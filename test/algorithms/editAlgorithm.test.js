/* eslint-disable func-names */
import {
  ALGORITHM_TABLE_ID,
  buildAlgorithmRowClass,
} from '../../src/config/selectors';
import { closeApplication, createApplication } from '../application';
import { DEFAULT_GLOBAL_TIMEOUT } from '../constants';
import {
  PREEXISTING_GRAASP_ALGORITHM,
  PREEXISTING_USER_ALGORITHM,
  REPLACEMENT_ALGORITHM,
} from '../fixtures/algorithms/algorithms';
import { mochaAsync } from '../utils';
import {
  checkAlgorithmRowLayout,
  clickAlgoEditButton,
  clickEditAlgoBackButton,
  clickEditAlgoSaveButton,
  editAlgorithm,
} from './utils';

describe.only('Edit Algorithm Scenarios', function () {
  this.timeout(DEFAULT_GLOBAL_TIMEOUT);
  let app = null;

  describe('General', () => {
    beforeEach(
      mochaAsync(async () => {
        app = await createApplication({
          database: { algorithms: [PREEXISTING_USER_ALGORITHM] },
        });
        const { client } = app;
        await client.goToAlgorithms();
      }),
    );

    afterEach(async () => {
      await closeApplication(app);
    });

    it(
      'Correclty edits an algorithm',
      mochaAsync(async () => {
        const { client } = app;

        await clickAlgoEditButton(client, PREEXISTING_USER_ALGORITHM);
        await editAlgorithm(client, REPLACEMENT_ALGORITHM);
        await clickEditAlgoSaveButton(client);
        await clickEditAlgoBackButton(client);

        await checkAlgorithmRowLayout(client, REPLACEMENT_ALGORITHM);
        await client.expectElementToNotExist(
          `#${ALGORITHM_TABLE_ID}`,
          `.${buildAlgorithmRowClass(PREEXISTING_USER_ALGORITHM.name)}`,
        );
      }),
    );

    it(
      'Clicking back button without saving does not edit algorithm',
      mochaAsync(async () => {
        const { client } = app;

        await clickAlgoEditButton(client, PREEXISTING_USER_ALGORITHM);
        await editAlgorithm(client, REPLACEMENT_ALGORITHM);
        await clickEditAlgoBackButton(client);

        await checkAlgorithmRowLayout(client, PREEXISTING_USER_ALGORITHM);
      }),
    );
  });

  describe('Graasp Algorithms', () => {
    beforeEach(
      mochaAsync(async () => {
        app = await createApplication({
          database: { algorithms: [PREEXISTING_GRAASP_ALGORITHM] },
        });
        const { client } = app;
        await client.goToAlgorithms();
      }),
    );

    it(
      'Editing a Graasp algorithm create a new algorithm',
      mochaAsync(async () => {
        const { client } = app;

        await clickAlgoEditButton(client, PREEXISTING_GRAASP_ALGORITHM);
        await editAlgorithm(client, REPLACEMENT_ALGORITHM);
        await clickEditAlgoSaveButton(client);

        await checkAlgorithmRowLayout(client, REPLACEMENT_ALGORITHM);
        await client.expectElementToExist(
          `#${ALGORITHM_TABLE_ID}`,
          `.${buildAlgorithmRowClass(PREEXISTING_GRAASP_ALGORITHM.name)}`,
        );
      }),
    );
  });
});
