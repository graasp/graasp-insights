''' Hash the userId field from the 'actions', 'appInstanceResources' and 'users'. Additionally remove every other field from the 'users' '''

from graasp_utils import load_dataset, save_dataset, sha256_hash, parse_arguments


def main():
    args = parse_arguments()

    dataset = load_dataset(args.dataset_path)

    for action in dataset['data']['actions']:
        if 'user' in action:
            action['user'] = sha256_hash(action['user'])

    for appInstanceResource in dataset['data']['appInstanceResources']:
        if 'user' in appInstanceResource:
            appInstanceResource['user'] = sha256_hash(
                appInstanceResource['user'])

    new_users = []
    for user in dataset['data']['users']:
        if '_id' in user:
            new_users.append({'_id': sha256_hash(user['_id'])})
    dataset['data']['users'] = new_users

    save_dataset(dataset, args.output_path)


if __name__ == '__main__':
    main()
