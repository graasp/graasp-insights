/* eslint-disable no-restricted-syntax */
/* eslint-disable func-names */
import { expect } from 'chai';
import GRAASP_ALGORITHMS from '../../public/shared/graaspAlgorithms';
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
      await client.goToAlgorithms();
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

      const nbAlgosPrev = await getNumberOfAlgorithms(client);

      await clickAlgoDeleteButton(client, PREEXISTING_USER_ALGORITHM);

      const nbAlgosAfter = await getNumberOfAlgorithms(client);
      expect(nbAlgosAfter - nbAlgosPrev).to.be.equal(-1);
    }),
  );

  it(
    'Adds, edits and deletes an algorithm',
    mochaAsync(async () => {
      const { client } = app;

      const nbAlgosPrev = await getNumberOfAlgorithms(client);

      // add algorithm
      await clickAddButton(client);
      await addAlgorithmFromFileLocation(client, SIMPLE_ALGORITHM);
      await clickAddAlgoSaveButton(client);
      await checkAlgorithmRowLayout(client, SIMPLE_ALGORITHM);

      const nbAlgosAfterAdd = await getNumberOfAlgorithms(client);
      expect(nbAlgosAfterAdd - nbAlgosPrev).to.be.equal(1);

      // replace algorithm
      await clickAlgoEditButton(client, SIMPLE_ALGORITHM);
      await editAlgorithm(client, REPLACEMENT_ALGORITHM);
      await clickEditAlgoSaveButton(client);
      await clickEditAlgoBackButton(client);
      await checkAlgorithmRowLayout(client, REPLACEMENT_ALGORITHM);

      const nbAlgosAfterEdit = await getNumberOfAlgorithms(client);
      expect(nbAlgosAfterEdit - nbAlgosAfterAdd).to.be.equal(0);

      // delete algorithm
      await clickAlgoDeleteButton(client, REPLACEMENT_ALGORITHM);

      const nbAlgosAfterDelete = await getNumberOfAlgorithms(client);
      expect(nbAlgosAfterDelete - nbAlgosAfterEdit).to.be.equal(-1);
    }),
  );
});
