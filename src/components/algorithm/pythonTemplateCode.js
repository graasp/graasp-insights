export default `from graasp_utils import load_dataset, save_dataset, parse_arguments

def main():
  args = parse_arguments()

  dataset = load_dataset(args.dataset_path)

  # write your dataset changes here

  save_dataset(dataset, args.output_path)

if __name__ == '__main__':
  main()
`;
