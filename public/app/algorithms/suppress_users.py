''' Suppress the 'users' field from a dataset'''

from utils import load_dataset, save_dataset, parse_arguments

def main():
    args = parse_arguments()

    dataset = load_dataset(args.dataset_path)

    del dataset['data']['users']

    save_dataset(dataset, args.output_path)

if __name__ == '__main__':
    main()
