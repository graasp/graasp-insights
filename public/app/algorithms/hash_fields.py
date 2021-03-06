"""Perform a SHA-256 hash on selected fields from a dataset"""

import json

from graasp_utils import (load_dataset, parse_arguments, save_dataset,
                          sha256_hash, iterate_and_apply)


def main():
    args = parse_arguments([
        {'name': 'fields', 'type': str}
    ])

    dataset = load_dataset(args.dataset_path)
    fields = json.loads(args.fields)

    iterate_and_apply(dataset, fields, sha256_hash)

    save_dataset(dataset, args.output_path)


if __name__ == '__main__':
    main()
