/* eslint-disable func-names */
import { expect } from 'chai';
import { ALGORITHM_TYPES } from '../../src/shared/constants';
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
  filterAlgorithmTableByType,
  getNumberOfAlgorithms,
} from './utils';

describe('Edit Algorithm Scenarios', function () {
  this.timeout(DEFAULT_GLOBAL_TIMEOUT);
  let app = null;

  afterEach(() => {
    return closeApplication(app);
  });

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

    it(
      'Correctly changes the type of an algorithm',
      mochaAsync(async () => {
        const { client } = app;

        await filterAlgorithmTableByType(client, ALGORITHM_TYPES.VALIDATION);
        const nbValAlgosPrev = await getNumberOfAlgorithms(client);

        await filterAlgorithmTableByType(client, ALGORITHM_TYPES.ANONYMIZATION);
        const nbAnonAlgosPrev = await getNumberOfAlgorithms(client);

        await clickAlgoEditButton(client, PREEXISTING_USER_ALGORITHM);
        const algorithmAsValidation = {
          ...PREEXISTING_USER_ALGORITHM,
          type: ALGORITHM_TYPES.VALIDATION,
        };
        await editAlgorithm(client, algorithmAsValidation);
        await clickEditAlgoSaveButton(client);
        await clickEditAlgoBackButton(client);

        await filterAlgorithmTableByType(client, ALGORITHM_TYPES.ANONYMIZATION);
        const nbAnonAlgosAfter = await getNumberOfAlgorithms(client);
        await client.expectElementToNotExist(
          `#${ALGORITHM_TABLE_ID}`,
          `.${buildAlgorithmRowClass(PREEXISTING_USER_ALGORITHM.name)}`,
        );

        await filterAlgorithmTableByType(client, ALGORITHM_TYPES.VALIDATION);
        const nbValAlgosAfter = await getNumberOfAlgorithms(client);

        // 1 less anonymization algorithms
        expect(nbAnonAlgosAfter - nbAnonAlgosPrev).to.equal(-1);
        // 1 more validation algorithms
        expect(nbValAlgosAfter - nbValAlgosPrev).to.equal(1);

        await checkAlgorithmRowLayout(client, algorithmAsValidation);

        await filterAlgorithmTableByType(client, ALGORITHM_TYPES.VALIDATION);
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
