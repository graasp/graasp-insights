/* eslint-disable func-names */
import { expect } from 'chai';
import GRAASP_ALGORITHMS from '../../src/shared/data/graaspAlgorithms';
import { closeApplication, createApplication } from '../application';
import { DEFAULT_GLOBAL_TIMEOUT } from '../constants';
import {
  MISSING_FILE_ALGORITHM,
  SIMPLE_ALGORITHM,
  SAMPLE_VALIDATION_ALGORITHM,
  PREEXISTING_GRAASP_ALGORITHM,
  PREEXISTING_USER_ALGORITHM,
  PREEXISTING_VALIDATION_ALGORITHM,
} from '../fixtures/algorithms/algorithms';
import { mochaAsync } from '../utils';
import {
  addAlgorithmFromEditor,
  addAlgorithmFromFileLocation,
  checkAlgorithmRowLayout,
  clickAddAlgoBackButton,
  clickAddAlgoSaveButton,
  clickAddButton,
  getNumberOfAlgorithms,
  addDefaultAlgorithm,
} from './utils';

describe('Add Algorithm Scenarios', function () {
  this.timeout(DEFAULT_GLOBAL_TIMEOUT);
  let app = null;

  beforeEach(
    mochaAsync(async () => {
      app = await createApplication({
        database: {
          algorithms: [
            PREEXISTING_GRAASP_ALGORITHM,
            PREEXISTING_USER_ALGORITHM,
            PREEXISTING_VALIDATION_ALGORITHM,
          ],
        },
      });
      const { client } = app;
      await client.goToAlgorithms();
    }),
  );

  afterEach(() => {
    return closeApplication(app);
  });

  it(
    'Using an incorrect algorithm file location leads to error',
    mochaAsync(async () => {
      const { client } = app;
      const nbAlgosPrev = await getNumberOfAlgorithms(client);

      // add algorithm
      await clickAddButton(client);
      await addAlgorithmFromFileLocation(client, MISSING_FILE_ALGORITHM);
      await clickAddAlgoSaveButton(client);

      const nbAlgosAfter = await getNumberOfAlgorithms(client);
      expect(nbAlgosAfter - nbAlgosPrev).to.equal(0);
    }),
  );

  it(
    'Correctly adds algorithm from file location',
    mochaAsync(async () => {
      const { client } = app;

      const nbAlgosPrev = await getNumberOfAlgorithms(client);

      // add algorithm
      await clickAddButton(client);
      await addAlgorithmFromFileLocation(client, SIMPLE_ALGORITHM);
      await clickAddAlgoSaveButton(client);

      const nbAlgosAfter = await getNumberOfAlgorithms(client);
      expect(nbAlgosAfter - nbAlgosPrev).to.equal(1);

      await checkAlgorithmRowLayout(client, SIMPLE_ALGORITHM);
    }),
  );

  it(
    'Correctly adds algorithm from editor',
    mochaAsync(async () => {
      const { client } = app;

      const nbAlgosPrev = await getNumberOfAlgorithms(client);

      // add algorithm
      await clickAddButton(client);
      await addAlgorithmFromEditor(client, SIMPLE_ALGORITHM);
      await clickAddAlgoSaveButton(client);

      const nbAlgosAfter = await getNumberOfAlgorithms(client);
      expect(nbAlgosAfter - nbAlgosPrev).to.equal(1);

      await checkAlgorithmRowLayout(client, SIMPLE_ALGORITHM);
    }),
  );

  it(
    'Correctly adds validation algorithm from editor',
    mochaAsync(async () => {
      const { client } = app;

      const nbValAlgosPrev = await getNumberOfAlgorithms(client);

      // add algorithm
      await clickAddButton(client);
      await addAlgorithmFromEditor(client, SAMPLE_VALIDATION_ALGORITHM);
      await clickAddAlgoSaveButton(client);

      const nbValAlgosAfter = await getNumberOfAlgorithms(client);
      expect(nbValAlgosAfter - nbValAlgosPrev).to.equal(1);

      await checkAlgorithmRowLayout(client, SIMPLE_ALGORITHM);
    }),
  );

  it(
    'Clicking back button before adding algorithm does not add it to database',
    mochaAsync(async () => {
      const { client } = app;

      const nbAlgosPrev = await getNumberOfAlgorithms(client);

      // add algorithm
      await clickAddButton(client);
      await addAlgorithmFromFileLocation(client, SIMPLE_ALGORITHM);
      await clickAddAlgoBackButton(client);

      const nbAlgosAfter = await getNumberOfAlgorithms(client);
      expect(nbAlgosAfter - nbAlgosPrev).to.equal(0);
    }),
  );

  it(
    'Adds default algorithm',
    mochaAsync(async () => {
      const { client } = app;
      const algorithm = GRAASP_ALGORITHMS[0];

      const nbAlgosPrev = await getNumberOfAlgorithms(client);

      // add algorithm
      await clickAddButton(client);
      await addDefaultAlgorithm(client, { id: algorithm.id });
      await clickAddAlgoSaveButton(client);

      const nbAlgosAfter = await getNumberOfAlgorithms(client);
      expect(nbAlgosAfter - nbAlgosPrev).to.equal(1);

      await checkAlgorithmRowLayout(client, algorithm);
    }),
  );
});
