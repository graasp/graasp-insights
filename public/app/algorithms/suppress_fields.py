''' Suppress the specified fields'''

import json

from graasp_utils import load_dataset, parse_arguments, save_dataset, iterate_and_suppress


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
