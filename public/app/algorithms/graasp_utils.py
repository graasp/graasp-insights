import json
import hashlib
import argparse
import platform


def open_file(file, permission='r'):
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


def parse_arguments(additional_arguments=[]):
    ''' Parses command-line arguments. '''
    parser = argparse.ArgumentParser()
    parser.add_argument('dataset_path')
    parser.add_argument('output_path')

    for arg in additional_arguments:
        if 'name' in arg and 'type' in arg:
            parser.add_argument('--%s' % arg["name"], type=arg["type"])

    return parser.parse_args()


def iterate_and_apply(dataset, field_selection, func):
    properties = field_selection.get('properties', {})
    for name, value in properties.items():
        if name in dataset:
            selected = value.get('selected', False)
            if selected:
                dataset[name] = func(dataset[name])
            elif value.get('type', '') == 'object':
                iterate_and_apply(dataset[name], value, func)
            elif value.get('type', '') == 'array' and isinstance(dataset[name], list):
                items = value.get('items', {})
                if isinstance(items, list):
                    for item, fl in zip(dataset[name], items):
                        iterate_and_apply(item, fl, func)

                elif isinstance(items, dict):
                    for item in dataset[name]:
                        iterate_and_apply(item, items, func)


def iterate_and_suppress(dataset, field_selection):
    properties = field_selection.get('properties', {})
    for name, value in properties.items():
        if name in dataset:
            selected = value.get('selected', False)
            if selected:
                del dataset[name]
            elif value.get('type', '') == 'object':
                iterate_and_suppress(dataset[name], value)
            elif value.get('type', '') == 'array' and isinstance(dataset[name], list):
                items = value.get('items', {})
                if isinstance(items, list):
                    for item, fl in zip(dataset[name], items):
                        iterate_and_suppress(item, fl)

                elif isinstance(items, dict):
                    for item in dataset[name]:
                        iterate_and_suppress(item, items)
