''' Suppress the 'data' field from the 'appInstanceResource' '''

from graasp_utils import load_dataset, save_dataset, parse_arguments

def main():
    args = parse_arguments()

    dataset = load_dataset(args.dataset_path)

    app_instance_resources = dataset['data']['appInstanceResources']

    for app_instance_resource in app_instance_resources:
        if 'data' in app_instance_resource:
            del app_instance_resource['data']

    save_dataset(dataset, args.output_path)

if __name__ == '__main__':
    main()
