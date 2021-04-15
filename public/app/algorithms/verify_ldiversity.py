"""By specifying the Quasi-Identifiers and Sensitive Attributes,
verifies if the dataset is l-diversified
"""

import json

from graasp_utils import (load_dataset, parse_arguments, ValidationOutcome,
                          notify_validation_result, get_selected_values, any_selected)


def compute_ldiversity(array, quasi_identifiers, sensitive_attributes):
    # retrieve the quasi-identifiers and sensitive values for each array
    # element
    qis = [get_selected_values(elem, quasi_identifiers) for elem in array]
    sas = [get_selected_values(elem, sensitive_attributes) for elem in array]

    # get the group of users for each distinct set of quasi-identifier
    # values
    distinct_qis = []
    groups = []

    for idx in range(len(array)):
        elem_qis = qis[idx]

        if elem_qis in distinct_qis:
            group_idx = distinct_qis.index(elem_qis)
            groups[group_idx].append(idx)
        else:
            groups.append([idx])
            distinct_qis.append(elem_qis)

    # iterate through each attribute and compute its l-diversity
    l_min = len(array)
    number_of_sas = len(sas[0])
    for i in range(number_of_sas):
        l_sa = len(array)

        # get the corresponding sa
        sa_values = [e_sas[i] for e_sas in sas]

        # for each group, get the number of distinct values for the sa
        for group in groups:
            group_sa_values = [sa_values[idx] for idx in group]
            group_distinct_sa_values = []
            for sa_value in group_sa_values:
                if sa_value not in group_distinct_sa_values:
                    group_distinct_sa_values.append(sa_value)

            # l_sa = smallest number of distinct sa values
            l_sa = min(l_sa, len(group_distinct_sa_values))

        # l = lowest l-diversity across sensitive attributes
        l_min = min(l_min, l_sa)

    return l_min


def find_selected_arrays(dataset, quasi_identifiers, sensitive_attributes):
    """Returns the arrays that contain selected sensitive attributes

    Returns:
        list[dict]: a list of dictionaries containing an 'array' and
        corresponding 'quasi_identifiers' and 'sensitive_attributes'
        field selections
    """
    type_ = sensitive_attributes.get('type', '')
    arrays = []

    # if object, then traverse its properties
    if 'object' in type_ and isinstance(dataset, dict):
        qi_properties = quasi_identifiers.get('properties', {})
        sa_properties = sensitive_attributes.get('properties', {})

        for name, sa_value in sa_properties.items():
            qi_value = qi_properties.get(name, {})
            if name in dataset and any_selected(sa_value):
                arrays.extend(find_selected_arrays(
                    dataset[name], qi_value, sa_value))

    # if array, then add it to the found arrays if any subfield is selected
    elif 'array' in type_ and isinstance(dataset, list):
        qi_items = quasi_identifiers.get('items', {})
        sa_items = sensitive_attributes.get('items', {})

        if isinstance(sa_items, dict) and any_selected(sa_items):
            arrays.append({
                'array': dataset,
                'quasi_identifiers': qi_items,
                'sensitive_attributes': sa_items
            })

    return arrays


def main():
    args = parse_arguments([
        {'name': 'quasi_identifiers', 'type': str},
        {'name': 'sensitive_attributes', 'type': str},
        {'name': 'l', 'type': int}
    ])

    dataset = load_dataset(args.dataset_path)
    quasi_identifiers = json.loads(args.quasi_identifiers)
    sensitive_attributes = json.loads(args.sensitive_attributes)
    relevant_arrays = find_selected_arrays(
        dataset, quasi_identifiers, sensitive_attributes)

    if len(relevant_arrays) == 0:
        notify_validation_result(
            ValidationOutcome.WARNING, "No sensitive attribute was found")
    else:
        # compute l-diversity for each array with SA's
        # final l-diversity will be the smallest of them
        ls = [compute_ldiversity(array['array'],
                                 array['quasi_identifiers'],
                                 array['sensitive_attributes'])
              for array in relevant_arrays]
        l = min(ls)

        if l >= args.l:
            notify_validation_result(
                ValidationOutcome.SUCCESS, f'{l}-diversified (>= {args.l})')
        else:
            notify_validation_result(
                ValidationOutcome.FAILURE, f'{l}-diversified (< {args.l})')


if __name__ == '__main__':
    main()
