''' Scan the dataset for occurrences of user names and user IDs, and replace such occurrences with a hash of the corresponding user ID '''

import re
from itertools import combinations

from graasp_utils import load_dataset, save_dataset, sha256_hash, parse_arguments

def find_and_replace(dataset, substitution_map):
    '''Traverses the whole a dataset, finds and replaces all occurrences
    based on regular expressions.

    Args:
        dataset (dict): the dataset
        substitution_map (dict): Dictionary that contains information
        for finding and replacing values. Entries should respect the
        format: value: { 'substitution', 'regex'}
    '''
    def regex_replace(s):
        for _, sub in substitution_map.items():
            matches = re.findall(sub['regex'], s, re.IGNORECASE)
            for match in matches:
                s = s.replace(match, sub['substitution'])
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

def get_regex(name):
    ''' Creates a regex to match the name or any similar version '''
    # accepts up to 3 characters between each word and ignores case
    return '(?i)' + '.{0,3}'.join(name.split())

def main():
    args = parse_arguments()

    dataset = load_dataset(args.dataset_path)

    users = dataset['data']['users']

    # prepare id and name substitutions
    # id substitution = hash(id)
    id_substitutions = { user['_id']: {
        'substitution': sha256_hash(user['_id']),
        'regex': user['_id']
    } for user in users}
    name_substitutions = { user['name']: {
        # name substitution = id substitution
        'substitution': id_substitutions[user['_id']]['substitution'],
        'regex': get_regex(user['name'])
    } for user in users}
    substitutions = [v['substitution'] for v in id_substitutions.values()]

    # replace the user ids in actions
    for action in dataset['data']['actions']:
        if 'user' in action:
            userid = action['user']
            if userid not in id_substitutions:
                id_substitutions[userid] = {
                    'substitution': sha256_hash(userid),
                    'regex': userid
                }

            action['user'] = id_substitutions[userid]['substitution']
    
    # replace the user ids in appInstanceResources
    for app_instance_res in dataset['data']['appInstanceResources']:
        if 'user' in app_instance_res:
            userid = app_instance_res['user']
            if userid not in id_substitutions:
                id_substitutions[userid] = {
                    'substitution': sha256_hash(userid),
                    'regex': userid
                }

            app_instance_res['user'] = id_substitutions[userid]['substitution']


    # generically search and replace occurrences of usernames and ids
    find_and_replace(dataset, name_substitutions)
    find_and_replace(dataset, id_substitutions)

    # the users fields are now just the hashes
    dataset['data']['users'] = substitutions

    save_dataset(dataset, args.output_path)

if __name__ == '__main__':
    main()
