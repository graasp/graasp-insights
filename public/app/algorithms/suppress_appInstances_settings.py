''' Suppress the 'settings' field from the 'appInstances' '''

from utils import load_dataset, save_dataset, parse_arguments

def main():
    args = parse_arguments()

    dataset = load_dataset(args.dataset_path)

    app_instances = dataset['data']['appInstances']

    for app_instance in app_instances:
        if 'settings' in app_instance:
            del app_instance['settings']

    save_dataset(dataset, args.output_path)

if __name__ == '__main__':
    main()
