import path from 'path';

// eslint-disable-next-line import/prefer-default-export
export const SIMPLE_DATASET = {
  name: 'name',
  description: 'description',
  filepath: path.resolve(__dirname, './sampleDataset.json'),
  spaceId: '5ed5f92233c8a33f3d5d87a5',
  spaceName: 'Mathematics',
  subSpaceCount: '0',
  actionCount: '1',
  userCount: '1',
  countryCount: '1',
};

export const MISSING_FILE_DATASET = {
  name: 'somename',
  description: 'somedescription',
  filepath: path.resolve(__dirname, './missingfile.json'),
};
