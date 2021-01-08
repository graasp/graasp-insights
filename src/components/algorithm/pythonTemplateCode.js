export default `from graasp_utils import load_dataset, save_dataset, parse_arguments

def main():
    # Prepares the parameters for the algorithm (dataset_path and output_path
    # come by default). You can then use them with args.parameter_name.
    # Avoid editing the parameters here, use the dedicated utility instead and
    # the code will change accordingly.
    args = parse_arguments()

    # load the json dataset, available as a python dictionary
    dataset = load_dataset(args.dataset_path)

    # write your dataset changes here

    save_dataset(dataset, args.output_path)

if __name__ == '__main__':
    main()
`;
