
import random
import json

from graasp_utils import load_dataset, save_dataset, parse_arguments


true_random = random.SystemRandom()


def shuffle_attribute(array, attribute):
    values = [elem.get(attribute, None) for elem in array]
    true_random.shuffle(values)
    for elem, new_value in zip(array, values):
        elem[attribute] = new_value


def iterate_and_shuffle(dataset, field_selection):
    properties = field_selection.get('properties', {})

    # iterate through each property
    for prop_name, prop_field_sel in properties.items():
        prop = dataset.get(prop_name, {})

        # if it is an object, iterate through its properties using recursion
        if prop_field_sel.get('type', '') == 'object':
            iterate_and_shuffle(prop, prop_field_sel)

        # if it is an array, "items" specifies the array's content
        elif prop_field_sel.get('type', '') == 'array' and isinstance(prop, list):
            items = prop_field_sel.get('items', {})

            # if "items" is a list
            # => 1st element matches with 1st field selection, 2nd elem with 2nd field selection, etc
            if isinstance(items, list):
                for item, fs in zip(prop, items):
                    iterate_and_shuffle(item, fs)

            # if "items" is an object/dict => every element matches the unique field selection
            elif isinstance(items, dict):
                sub_properties = items.get('properties', {})
                selected_attributes = [attribute for attribute, sub_value in sub_properties.items(
                ) if sub_value.get('selected', False)]

                for attribute in selected_attributes:
                    shuffle_attribute(prop, attribute)

                for item in prop:
                    iterate_and_shuffle(item, items)


def main():
    args = parse_arguments([
        {'name': 'fields', 'type': str}
    ])

    dataset = load_dataset(args.dataset_path)
    fields = json.loads(args.fields)

    iterate_and_shuffle(dataset, fields)

    save_dataset(dataset, args.output_path)


if __name__ == '__main__':
    main()
