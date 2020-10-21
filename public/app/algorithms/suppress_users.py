''' Suppress the users field from a dataset '''

import json, argparse

def load_dataset(dataset_path):
    ''' Load a json dataset from the specified path '''
    with open(dataset_path) as json_file:
        return json.load(json_file)

def save_dataset(dataset, dest_path):
    ''' Save a json dataset to the specified path '''
    with open(dest_path, 'w') as dest_file:
        json.dump(dataset, dest_file, indent=2)

def parse_arguments():
    ''' Parses command-line arguments. '''
    parser = argparse.ArgumentParser(description='Suppress the users field from a dataset')
    parser.add_argument('dataset_path', help='path to the json dataset')
    parser.add_argument('output_path', default='output.json',
        help='destination path (including file name) for the output')

    return parser.parse_args()

def main():
    args = parse_arguments()

    dataset = load_dataset(args.dataset_path)

    del dataset['data']['users']

    save_dataset(dataset, args.output_path)

if __name__ == '__main__':
    main()
