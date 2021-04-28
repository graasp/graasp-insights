import json
import hashlib
import argparse
import platform


def open_file(file, permission='r'):
    version = platform.python_version()[0]
    if version == "3":
        return open(file, permission, encoding="utf8")
    else:
        return open(file, permission)


def load_dataset(dataset_path):
    with open_file(dataset_path) as json_file:
        return json.load(json_file)


def save_dataset(dataset, dest_path):
    with open_file(dest_path, 'w') as dest_file:
        json.dump(dataset, dest_file, indent=2)


def sha256_hash(value):
    return hashlib.sha256(value.encode()).hexdigest()


def parse_arguments(additional_arguments=[]):
    """Parses command-line arguments."""
    parser = argparse.ArgumentParser()
    parser.add_argument('--dataset_path', type=str)
    parser.add_argument('--output_path', type=str)
    parser.add_argument('--origin_path', type=str)

    for arg in additional_arguments:
        if 'name' in arg and 'type' in arg:
            parser.add_argument('--%s' % arg["name"], type=arg["type"])

    return parser.parse_args()


def iterate_and_apply(dataset, field_selection, func):
    """Iterate over a dataset using a field selection and apply a
    function on the selected attributes
    """

    type_ = field_selection.get('type', '')

    if 'object' in type_ and isinstance(dataset, dict):
        properties = field_selection.get('properties', {})

        for name, value in properties.items():
            if name in dataset:
                selected = value.get('selected', False)
                if selected:
                    dataset[name] = func(dataset[name])
                if any_selected(value):
                    iterate_and_apply(dataset[name], value, func)

    elif 'array' in type_ and isinstance(dataset, list):
        items = field_selection.get('items', {})
        if isinstance(items, dict) and any_selected(items):
            for elem in dataset:
                iterate_and_apply(elem, items, func)
        elif isinstance(items, list):
            for idx in range(min(len(dataset), len(items))):
                elem_field_selection = field_selection[idx]
                selected = elem_field_selection.get('selected', False)
                if selected:
                    dataset[idx] = func(dataset[idx])
                if any_selected(elem_field_selection):
                    iterate_and_apply(dataset[idx], elem_field_selection, func)


def iterate_and_suppress(dataset, field_selection):
    """Iterate over a dataset using a field selection and suppress
    selected attributes
    """
    type_ = field_selection.get('type', '')

    if 'object' in type_ and isinstance(dataset, dict):
        properties = field_selection.get('properties', {})

        for name, value in properties.items():
            if name in dataset:
                selected = value.get('selected', False)
                if selected:
                    del dataset[name]
                elif any_selected(value):
                    iterate_and_suppress(dataset[name], value)

    elif 'array' in type_ and isinstance(dataset, list):
        items = field_selection.get('items', {})
        if isinstance(items, dict) and any_selected(items):
            for elem in dataset:
                iterate_and_suppress(elem, items)
        elif isinstance(items, list):
            for idx in range(min(len(dataset), len(items))):
                elem_field_selection = field_selection[idx]
                selected = elem_field_selection.get('selected', False)
                if selected:
                    del dataset[idx]
                if any_selected(elem_field_selection):
                    iterate_and_suppress(dataset[idx], elem_field_selection)


class ValidationOutcome:
    SUCCESS = 'success'
    WARNING = 'warning'
    FAILURE = 'failure'


def notify_validation_result(outcome, info):
    """Print a stringified dictionary of the outcomes of a validation
    algorithm.

    The printing format is specifically targeted for communicating the
    outcome of a validation algorithm back to the Graasp Insights
    client.

    Args:
        outcome (ValidationOutcome): the outcome status (whether it was
        successful or not)
        info (str): additional information giving more context relative
        to the outcome
    """
    print(json.dumps({"outcome": outcome, "info": info}))


def any_selected(field_selection):
    """Checks if a field selection has any of its properties selected"""

    # check if root level is selected
    # if it is an object or an array, recursively check its properties
    selected = field_selection.get('selected', False)
    type_ = field_selection.get('type', '')
    if 'object' in type_:
        properties = field_selection.get('properties', {})
        selected |= any(
            [any_selected(value) for value in properties.values()]
        )

    if 'array' in type_:
        items = field_selection.get('items', {})
        if isinstance(items, dict):
            selected |= any_selected(items)
        elif isinstance(items, dict):
            selected |= any([any_selected(value) for value in items])

    return selected


def find_selected_arrays(dataset, field_selection):
    """Returns the arrays that contain selected properties 

    Returns:
        list[dict]: a list of dictionaries containing an 'array' and a
        corresponding 'field_selection'
    """

    type_ = field_selection.get('type', '')
    arrays = []

    # if object, then traverse its properties
    if 'object' in type_ and isinstance(dataset, dict):
        properties = field_selection.get('properties', {})

        for name, value in properties.items():
            if name in dataset and any_selected(value):
                arrays.extend(find_selected_arrays(dataset[name], value))

    # if array, then add it to the found arrays if any subfield is
    # selected
    elif 'array' in type_ and isinstance(dataset, list):
        items = field_selection.get('items', {})

        selected = field_selection.get(
            'selected', False) or any_selected(items)

        if isinstance(items, dict) and selected:
            arrays.append(
                {'array': dataset, 'field_selection': field_selection})

    return arrays


def get_selected_values(elem, field_selection):
    """Traverse a element using a field_selection and retrieve a list
    the corresponding selected values
    """
    values = []
    selected = field_selection.get('selected', False)
    if selected:
        values.append(elem)

    type_ = field_selection.get('type', '')

    # object -> iterate over properties
    if 'object' in type_ and isinstance(elem, dict):
        properties = field_selection.get('properties', {})

        for name, value in properties.items():
            if name in elem and any_selected(value):
                values.extend(get_selected_values(elem[name], value))

    # array -> iterate over array elements
    elif 'array' in type_ and isinstance(elem, list):
        items = field_selection.get('items', {})
        if isinstance(items, dict) and any_selected(items):
            for a_elem in elem:
                values.extend(get_selected_values(a_elem, items))
        elif isinstance(items, list):
            for a_elem, a_field_selection in zip(elem, items):
                if any_selected(a_field_selection):
                    values.extend(get_selected_values(
                        elem, a_field_selection))

    return values


version = platform.python_version()[0]
if version == "3":
    def isstr(s):
        # in python 2.* unicode strings are not an instance of str
        # in python 3.*, they are
        return isinstance(s, str)
else:
    def isstr(s):
        # in python 2.*, basestring matches both natural strings and
        # unicode strings
        # in python 3.*, basestring doesn't exist
        return isinstance(s, basestring)
