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
  schemaIds: [GRAASP_SCHEMA_ID],
  originId: 'simple-dataset-name',
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
  schemaIds: [GRAASP_SCHEMA_ID],
};

export const DATASET_FOR_SCHEMA = {
  id: 'dataset-for-schema',
  name: 'dataset for schema',
  filepath: path.join(__dirname, './datasetForSchema.json'),
  size: 1000,
  createdAt: Date.now(),
  lastModified: Date.now(),
  type: DATASET_TYPES.SOURCE,
  schemaIds: [],
};

const tabularDatasetContent = [
  ['Justin', 18, 'Lausanne', 6, 'None'],
  ['Daniel', 19, 'Neuchâtel', 5.5, 'None'],
  ['Christopher', 18, 'Genève', 5.5, 'Dysgraphia'],
  ['Christine', 22, 'Lausanne', 6, 'None'],
  ['Nicole', 21, 'Lausanne', 3, 'None'],
  ['Katherine', 25, 'Genève', 3.5, 'Dyslexia'],
  ['Andrea', 21, 'Paris', 4.5, 'None'],
  ['Antonio', 23, 'Lyon', 5, 'None'],
  ['Gabriella', 22, 'Nantes', 5, 'None'],
];

export const CSV_DATASET = {
  id: 'csv-dataset',
  name: 'csv-dataset',
  description: 'description',
  filepath: path.join(__dirname, './csvDataset.csv'),
  size: 100,
  createdAt: Date.now(),
  lastModified: Date.now(),
  type: DATASET_TYPES.SOURCE,
  schemaIds: [],
  content: tabularDatasetContent,
};

export const XLSX_DATASET = {
  id: 'xlsx-dataset',
  name: 'xlsx-dataset',
  description: 'description',
  filepath: path.join(__dirname, './xlsxDataset.xlsx'),
  size: 100,
  createdAt: Date.now(),
  lastModified: Date.now(),
  type: DATASET_TYPES.SOURCE,
  schemaIds: [],
  content: tabularDatasetContent,
};
