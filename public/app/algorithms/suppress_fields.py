"""Completely remove selected fields from a dataset"""

import json

from graasp_utils import (load_dataset, parse_arguments, save_dataset,
                          iterate_and_suppress)


def main():
    args = parse_arguments([
        {'name': 'fields', 'type': str}
    ])

    dataset = load_dataset(args.dataset_path)
    fields = json.loads(args.fields)

    iterate_and_suppress(dataset, fields)

    save_dataset(dataset, args.output_path)


if __name__ == '__main__':
    main()
