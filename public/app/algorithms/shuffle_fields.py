"""Given an array of objects, this algorithm randomly shuffles the
values in selected keys between the array's objects
"""

import random
import json

from graasp_utils import (load_dataset, save_dataset, parse_arguments,
                          find_selected_arrays)

true_random = random.SystemRandom()


def shuffle_attributes(array, field_selection):
    selected = field_selection.get('selected', False)

    # if the array itself is selected, then shuffle its elements
    if selected:
        true_random.shuffle(array)

    # shuffle each selected property across the array
    properties = field_selection.get('items', {}).get('properties', {})
    for name, value in properties.items():
        if value.get('selected', False):
            new_values = [elem.get(name, None) for elem in array]
            true_random.shuffle(new_values)
            for elem, new_value in zip(array, new_values):
                elem[name] = new_value


def main():
    args = parse_arguments([
        {'name': 'fields', 'type': str}
    ])

    dataset = load_dataset(args.dataset_path)
    fields = json.loads(args.fields)

    relevant_arrays = find_selected_arrays(dataset, fields)
    for array in relevant_arrays:
        shuffle_attributes(
            array['array'], array['field_selection']),

    save_dataset(dataset, args.output_path)


if __name__ == '__main__':
    main()
