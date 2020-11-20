''' Suppress the 'geolocation' field from the 'actions' '''

from graasp_utils import load_dataset, save_dataset, parse_arguments

def main():
    args = parse_arguments()

    dataset = load_dataset(args.dataset_path)

    actions = dataset['data']['actions']

    for action in actions:
        if 'geolocation':
            del action['geolocation']

    save_dataset(dataset, args.output_path)

if __name__ == '__main__':
    main()
