/* eslint-disable no-restricted-syntax */
/* eslint-disable func-names */
import { expect } from 'chai';
import GRAASP_ALGORITHMS from '../../public/app/config/graaspAlgorithms';
import { closeApplication, createApplication } from '../application';
import { DEFAULT_GLOBAL_TIMEOUT } from '../constants';
import {
  REPLACEMENT_ALGORITHM,
  SIMPLE_ALGORITHM,
  PREEXISTING_USER_ALGORITHM,
} from '../fixtures/algorithms/algorithms';
import { mochaAsync } from '../utils';
import {
  addAlgorithmFromFileLocation,
  checkAlgorithmRowLayout,
  clickAddAlgoSaveButton,
  clickAddButton,
  clickAlgoDeleteButton,
  clickAlgoEditButton,
  clickEditAlgoBackButton,
  clickEditAlgoSaveButton,
  editAlgorithm,
  getNumberOfAlgorithms,
  menuGoToAlgorithms,
} from './utils';

describe('Algorithms Scenarios', function () {
  this.timeout(DEFAULT_GLOBAL_TIMEOUT);
  let app = null;

  beforeEach(
    mochaAsync(async () => {
      app = await createApplication({
        database: { algorithms: [PREEXISTING_USER_ALGORITHM] },
        responses: { showMessageDialogResponse: 1 },
      });
      const { client } = app;
      client.setTimeout({ implicit: 0 });
      await menuGoToAlgorithms(client);
    }),
  );

  afterEach(() => {
    return closeApplication(app);
  });

  it(
    'Correctly initialize Graasp algorithms',
    mochaAsync(async () => {
      const { client } = app;

      for (const algorithm of GRAASP_ALGORITHMS) {
        // eslint-disable-next-line no-await-in-loop
        await checkAlgorithmRowLayout(client, algorithm);
      }
    }),
  );

  it(
    'Correctly delete an algorithm',
    mochaAsync(async () => {
      const { client } = app;

      const nAlgosPrior = await getNumberOfAlgorithms(client);

      await clickAlgoDeleteButton(client, PREEXISTING_USER_ALGORITHM);

      const nAlgosAfter = await getNumberOfAlgorithms(client);
      expect(nAlgosAfter - nAlgosPrior).to.be.equal(-1);
    }),
  );

  it(
    'Adds, edits and deletes an algorithm',
    mochaAsync(async () => {
      const { client } = app;

      const nAlgosStart = await getNumberOfAlgorithms(client);

      // add algorithm
      await clickAddButton(client);
      await addAlgorithmFromFileLocation(client, SIMPLE_ALGORITHM);
      await clickAddAlgoSaveButton(client);
      await checkAlgorithmRowLayout(client, SIMPLE_ALGORITHM);

      const nAlgosAfterAdd = await getNumberOfAlgorithms(client);
      expect(nAlgosAfterAdd - nAlgosStart).to.be.equal(1);

      // replace algorithm
      await clickAlgoEditButton(client, SIMPLE_ALGORITHM);
      await editAlgorithm(client, REPLACEMENT_ALGORITHM);
      await clickEditAlgoSaveButton(client);
      await clickEditAlgoBackButton(client);
      await checkAlgorithmRowLayout(client, REPLACEMENT_ALGORITHM);

      const nAlgosAfterEdit = await getNumberOfAlgorithms(client);
      expect(nAlgosAfterEdit - nAlgosAfterAdd).to.be.equal(0);

      // delete algorithm
      await clickAlgoDeleteButton(client, REPLACEMENT_ALGORITHM);

      const nAlgosAfterDelete = await getNumberOfAlgorithms(client);
      expect(nAlgosAfterDelete - nAlgosAfterEdit).to.be.equal(-1);
    }),
  );
});
