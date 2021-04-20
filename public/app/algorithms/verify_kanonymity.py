"""By specifying the Quasi-Identifiers, verifies if the dataset is
k-anonymous
"""

import json

from graasp_utils import (load_dataset, parse_arguments, ValidationOutcome,
                          notify_validation_result, find_selected_arrays,
                          get_selected_values)


def compute_kanonymity(array, quasi_identifiers):
    # retrieve the quasi-identifiers for each array element
    qis = [get_selected_values(
        elem, quasi_identifiers.get('items', {})) for elem in array]

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

    # k = size of the smallest group
    k = min(map(len, groups))

    return k


def main():
    args = parse_arguments([
        {'name': 'quasi_identifiers', 'type': str},
        {'name': 'k', 'type': int}
    ])

    dataset = load_dataset(args.dataset_path)
    quasi_identifiers = json.loads(args.quasi_identifiers)
    relevant_arrays = find_selected_arrays(dataset, quasi_identifiers)

    if len(relevant_arrays) == 0:
        notify_validation_result(
            ValidationOutcome.WARNING, "No quasi identifier was found")
    else:
        # compute k-anonymity for each array containing QI's.
        # final k-anonymity will be the lowest of them
        ks = [compute_kanonymity(a['array'], a['field_selection'])
              for a in relevant_arrays]
        k = min(ks)

        if k >= args.k:
            notify_validation_result(
                ValidationOutcome.SUCCESS, f'{k}-anonymous (>= {args.k})')
        else:
            notify_validation_result(
                ValidationOutcome.FAILURE, f'{k}-anonymous (< {args.k})')


if __name__ == '__main__':
    main()
