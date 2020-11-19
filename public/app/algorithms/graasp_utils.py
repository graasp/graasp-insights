import json, hashlib, argparse

def open_file(file, permission = 'r'):
    version = platform.python_version()[0]
    if version == 3:
        return open(file, permission, encoding="utf8")
    else:
        return open(file, permission)

def load_dataset(dataset_path):
    with open_file(dataset_path) as json_file:
        return json.load(json_file)

def save_dataset(dataset, dest_path):
    with open_file(dest_path, 'w') as dest_file:
        json.dump(dataset, dest_file, indent=2)

def sha256_hash(value):
    return hashlib.sha256(value.encode()).hexdigest()

def parse_arguments():
    ''' Parses command-line arguments. '''
    parser = argparse.ArgumentParser()
    parser.add_argument('dataset_path')
    parser.add_argument('output_path')

    return parser.parse_args()
