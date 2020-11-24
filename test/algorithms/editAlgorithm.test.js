/* eslint-disable func-names */
import { expect } from 'chai';
import GRAASP_ALGORITHMS from '../../public/app/config/graaspAlgorithms';
import { closeApplication, createApplication } from '../application';
import { DEFAULT_GLOBAL_TIMEOUT } from '../constants';
import {
  REPLACEMENT_ALGORITHM,
  SIMPLE_ALGORITHM,
} from '../fixtures/algorithms/algorithms';
import { mochaAsync } from '../utils';
import {
  addAlgorithmFromFileLocation,
  checkAlgorithmRowLayout,
  clickAddAlgoSaveButton,
  clickAddButton,
  clickAlgoEditButton,
  clickEditAlgoBackButton,
  clickEditAlgoSaveButton,
  editAlgorithm,
  getNumberOfAlgorithms,
  menuGoToAlgorithms,
} from './utils';

describe('Edit Algorithm Scenarios', function () {
  this.timeout(DEFAULT_GLOBAL_TIMEOUT);
  let app = null;

  beforeEach(
    mochaAsync(async () => {
      app = await createApplication();
      const { client } = app;
      client.setTimeout({ implicit: 0 });
      await menuGoToAlgorithms(client);
    }),
  );

  afterEach(() => {
    return closeApplication(app);
  });

  it(
    'Editing a graasp algorithm creates a copy',
    mochaAsync(async () => {
      const { client } = app;

      const nAlgosPrior = await getNumberOfAlgorithms(client);

      await clickAlgoEditButton(client, GRAASP_ALGORITHMS[0]);
      await editAlgorithm(client, REPLACEMENT_ALGORITHM);
      await clickEditAlgoSaveButton(client);

      const nAlgosAfter = await getNumberOfAlgorithms(client);
      expect(nAlgosAfter - nAlgosPrior).to.equal(1);

      await checkAlgorithmRowLayout(client, REPLACEMENT_ALGORITHM);
      await checkAlgorithmRowLayout(client, GRAASP_ALGORITHMS[0]);
    }),
  );

  it(
    'Clicking back button without saving does not edit algorithm',
    mochaAsync(async () => {
      const { client } = app;

      // add algo
      await clickAddButton(client);
      await addAlgorithmFromFileLocation(client, SIMPLE_ALGORITHM);
      await clickAddAlgoSaveButton(client);
      await checkAlgorithmRowLayout(client, SIMPLE_ALGORITHM);

      await clickAlgoEditButton(client, GRAASP_ALGORITHMS[0]);
      await editAlgorithm(client, REPLACEMENT_ALGORITHM);
      await clickEditAlgoBackButton(client);

      await checkAlgorithmRowLayout(client, SIMPLE_ALGORITHM);
    }),
  );
});
