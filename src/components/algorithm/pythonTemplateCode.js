export default `from graasp_utils import load_dataset, save_dataset, parse_arguments

def main():
    # prepares the parameters for the algorithm (dataset_path and output_path come
    # by default). You can then use them with args.parameter_name
    args = parse_arguments()

    # load the json dataset, available as a python dictionary
    dataset = load_dataset(args.dataset_path)

    # write your dataset changes here

    save_dataset(dataset, args.output_path)

if __name__ == '__main__':
    main()
`;
