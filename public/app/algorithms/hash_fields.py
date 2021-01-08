''' Hash the specified fields '''

import json

from graasp_utils import (load_dataset, parse_arguments, save_dataset,
                          sha256_hash, iterate_and_apply)


def main():
    args = parse_arguments([
        {'name': 'hashed_fields', 'type': str}
    ])

    dataset = load_dataset(args.dataset_path)
    hashed_fields = json.loads(args.hashed_fields)

    iterate_and_apply(dataset, hashed_fields, sha256_hash)

    save_dataset(dataset, args.output_path)


if __name__ == '__main__':
    main()
