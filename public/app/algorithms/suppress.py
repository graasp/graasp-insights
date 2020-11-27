''' Suppress the specified fields'''

import json

from graasp_utils import load_dataset, parse_arguments, save_dataset


def iterate_and_suppress(dataset, path):
    if isinstance(dataset, list):
        for item in dataset:
            iterate_and_suppress(item, path)
        return

    children = path.get('children', {})
    for name, properties in children.items():
        if name in dataset:
            selected = properties.get('selected', False)
            if selected:
                del dataset[name]
            elif 'children' in properties:
                iterate_and_suppress(dataset[name], properties)


def main():
    args = parse_arguments([
        {'name': 'suppressed_fields', 'type': str}
    ])

    dataset = load_dataset(args.dataset_path)
    suppressed_fields = json.loads(args.suppressed_fields)

    iterate_and_suppress(dataset, suppressed_fields)

    save_dataset(dataset, args.output_path)


if __name__ == '__main__':
    main()
