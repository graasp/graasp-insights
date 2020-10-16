""" Anonymize a dataset: removes sensitive values and replaces names/ids by hashes """

import json
import argparse
import re

def load_dataset(dataset_path):
    """Load a json dataset from the specified path

    Args:
        dataset_path (string): the path to the dataset

    Returns:
        dict: the json dataset
    """
    with open(dataset_path) as json_file:
        return json.load(json_file)

def save_dataset(dataset, dest_path):
    """Save a json dataset to the specified path

    Args:
        dataset (dict): the dataset we want to save
        dest_path ([type]): the destination path for the dataset
    """
    with open(dest_path, 'w') as dest_file:
        json.dump(dataset, dest_file, indent=2)

def iterate_and_suppress(dataset, path):
    if isinstance(dataset, list):
        for item in dataset:
            iterate_and_suppress(item, path)
        return

    # path is string (leaf) => delete
    if isinstance(path, str):
        del dataset[path]

    # path is list => iterate through each sub path
    elif isinstance(path, list):
        for subpath in path:
            iterate_and_suppress(dataset, subpath)

    # path is dict/object => dive into each sub path
    elif isinstance(path, dict):
        for key, subpath in path.items():
            if key in dataset:
                iterate_and_suppress(dataset[key], subpath)

def find_and_replace(dataset, substitution_map):
    """Traverses the whole a dataset, finds and replaces all occurences
    based on regular expressions.

    Args:
        dataset (dict): the dataset
        substitution_map (dict): Dictionary that contains information
        for finding and replacing values. Entries should respect the
        format: value: { "substitution", "regex"}
    """
    def regex_replace(s):
        for _, sub in substitution_map.items():
            matches = re.findall(sub["regex"], s, re.IGNORECASE)
            for match in matches:
                s = s.replace(match, sub["substitution"])
        return s

    def traverse(current_data):
        if isinstance(current_data, list):
            for idx, v in enumerate(current_data):
                if isinstance(v, dict) or isinstance(v, list):
                    traverse(v)
                elif isinstance(v, str):
                    current_data[idx] = regex_replace(v)
        
        elif isinstance(current_data, dict):
            for key, v in current_data.items():
                if isinstance(v, dict) or isinstance(v, list):
                    traverse(v)
                elif isinstance(v, str):
                    current_data[key] = regex_replace(v)
    
    traverse(dataset)

def parse_arguments():
    """ Parses command-line arguments. """
    parser = argparse.ArgumentParser(description='default anonymization on a dataset.')
    parser.add_argument('dataset_path', help='path to the json dataset')
    parser.add_argument('output_path', default="output.json",
        help="destination path (including file name) for the output")

    return parser.parse_args()

def hash_and_str(value):
    """ Hash a stringify a value. """
    return str(hash(value))

def get_regex(name):
    """ Creates a regex to match the name or any similar version """
    # accepts up to 3 characters between each word and ignores case
    return "(?i)" + '.{0,3}'.join(name.split())

def main():
    """ Anonymize a dataset: removes sensitive values and replaces names/ids by hashes  """
    args = parse_arguments()

    dataset = load_dataset(args.dataset_path)

    suppressed_fields = {
        'data': [
            {
                'actions': ['geolocation', 'data']
            },
            'users'
        ],
    }

    users = dataset["data"]["users"]
    names = [u["name"] for u in users]
    name_substitutions = { name: {
        "substitution": str(hash(name)),
        "regex": get_regex(name)
    } for name in names}

    id_substitutions = { u["_id"]: {
        "substitution": name_substitutions[u["name"]]["substitution"],
        "regex": u["_id"]
    } for u in users}

    iterate_and_suppress(dataset, suppressed_fields)
    find_and_replace(dataset, name_substitutions)
    find_and_replace(dataset, id_substitutions)

    save_dataset(dataset, args.output_path)

if __name__ == "__main__":
    main()
