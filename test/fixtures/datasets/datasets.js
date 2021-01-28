import path from 'path';
import { DATASET_TYPES, GRAASP_SCHEMA_ID } from '../../../src/shared/constants';

// eslint-disable-next-line import/prefer-default-export
export const SIMPLE_DATASET = {
  id: 'simple-dataset-name',
  name: 'simple-dataset-name',
  description: 'description',
  filepath: path.resolve(__dirname, './sampleDataset.json'),
  spaceId: '5ed5f92233c8a33f3d5d87a5',
  spaceName: 'Mathematics',
  subSpaceCount: '0',
  actionCount: '1',
  userCount: '1',
  countryCount: '1',
  size: 45,
  createdAt: Date.now(),
  lastModified: Date.now(),
  type: DATASET_TYPES.SOURCE,
};

export const MISSING_FILE_DATASET = {
  name: 'somename',
  description: 'somedescription',
  filepath: path.resolve(__dirname, './missingfile.json'),
};

export const DATASET_1000_KB = {
  id: 'dataset-1000',
  name: 'my dataset',
  filepath: path.join(__dirname, './dataset1000KB.json'),
  size: 1000,
  createdAt: Date.now(),
  lastModified: Date.now(),
  type: DATASET_TYPES.SOURCE,
  schema: GRAASP_SCHEMA_ID,
};
