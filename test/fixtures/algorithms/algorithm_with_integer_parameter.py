from graasp_utils import load_dataset, save_dataset, parse_arguments


def main():
    args = parse_arguments([
        {'name': 'positive_integer', 'type': int}
    ])

    dataset = load_dataset(args.dataset_path)

    if args.positive_integer < 0:
        raise Exception

    save_dataset(dataset, args.output_path)


if __name__ == '__main__':
    main()
