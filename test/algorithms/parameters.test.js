/* eslint-disable func-names */
import { expect } from 'chai';
import { closeApplication, createApplication } from '../application';
import { DEFAULT_GLOBAL_TIMEOUT } from '../constants';
import {
  ALGORITHM_WITH_PARAMETERS,
  ALGORITHM_WITH_CORRUPTED_FIELD_SELECTORS,
  ALGORITHM_WITH_UNDEFINED_FIELD_SELECTORS,
  ALGORITHM_WITH_NO_SCHEMA_FIELD_SELECTORS,
} from '../fixtures/algorithms/algorithms';
import { mochaAsync } from '../utils';
import {
  addAlgorithmFromEditor,
  checkAlgorithmRowLayout,
  clickAddAlgoSaveButton,
  clickAddButton,
  getNumberOfAlgorithms,
  addParameters,
  clickAddAlgoBackButton,
} from './utils';
import { DEFAULT_SCHEMAS } from '../../public/app/schema/config';
import { GRAASP_SCHEMA_ID } from '../../src/shared/constants';
import {
  INITIAL_CORRUPTED_SCHEMA,
  INITIAL_UNDEFINED_SCHEMA,
} from '../fixtures/schema/schemas';
import {
  ADD_ALGORITHM_SAVE_BUTTON_ID,
  ALERT_FIELD_SELECTOR_NO_SCHEMA_AVAILABLE_ID,
  buildAlertFieldSelectorUndefinedSchema,
} from '../../src/config/selectors';

describe('Algorithm Parameters Scenarios', function () {
  this.timeout(DEFAULT_GLOBAL_TIMEOUT);
  let app = null;

  describe('With Schemas', () => {
    beforeEach(
      mochaAsync(async () => {
        app = await createApplication({
          database: {
            schemas: [
              DEFAULT_SCHEMAS[GRAASP_SCHEMA_ID],
              INITIAL_UNDEFINED_SCHEMA,
              INITIAL_CORRUPTED_SCHEMA,
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
      'Adds algorithm with parameters',
      mochaAsync(async () => {
        const { client } = app;

        const nbAlgosPrev = await getNumberOfAlgorithms(client);

        // add algorithm
        await clickAddButton(client);
        await addAlgorithmFromEditor(client, ALGORITHM_WITH_PARAMETERS);
        await addParameters(client, ALGORITHM_WITH_PARAMETERS);

        await clickAddAlgoSaveButton(client);

        const nbAlgosAfter = await getNumberOfAlgorithms(client);
        expect(nbAlgosAfter - nbAlgosPrev).to.equal(1);

        await checkAlgorithmRowLayout(client, ALGORITHM_WITH_PARAMETERS);
      }),
    );

    it(
      'Cannot add algorithm with field selector from corrupted or undefined schemas',
      mochaAsync(async () => {
        const { client } = app;

        // ---- undefined schema for field selector
        await clickAddButton(client);
        await addAlgorithmFromEditor(
          client,
          ALGORITHM_WITH_UNDEFINED_FIELD_SELECTORS,
        );

        await addParameters(client, ALGORITHM_WITH_UNDEFINED_FIELD_SELECTORS);
        // should display error alert
        const {
          schema: undefinedSchema,
        } = ALGORITHM_WITH_UNDEFINED_FIELD_SELECTORS.parameters[0];
        await client.expectElementToExist(
          `#${buildAlertFieldSelectorUndefinedSchema(undefinedSchema)}`,
        );

        await client.pause(500);

        // cannot save
        let saveButton = await client.$(`#${ADD_ALGORITHM_SAVE_BUTTON_ID}`);
        expect(await saveButton.getAttribute('disabled')).to.equal('true');

        await clickAddAlgoBackButton(client);

        // ---- incorrect schema for field selector
        await clickAddButton(client);
        await addAlgorithmFromEditor(
          client,
          ALGORITHM_WITH_CORRUPTED_FIELD_SELECTORS,
        );
        await addParameters(client, ALGORITHM_WITH_CORRUPTED_FIELD_SELECTORS);

        // should display error alert
        const {
          schema: corruptedSchema,
        } = ALGORITHM_WITH_CORRUPTED_FIELD_SELECTORS.parameters[0];
        await client.expectElementToExist(
          `#${buildAlertFieldSelectorUndefinedSchema(corruptedSchema)}`,
        );

        await client.pause(500);

        // cannot save
        saveButton = await client.$(`#${ADD_ALGORITHM_SAVE_BUTTON_ID}`);
        expect(await saveButton.getAttribute('disabled')).to.equal('true');
      }),
    );
  });

  describe('No Schema', () => {
    beforeEach(
      mochaAsync(async () => {
        app = await createApplication();
        const { client } = app;
        await client.goToAlgorithms();
      }),
    );

    afterEach(() => {
      return closeApplication(app);
    });

    it(
      'Cannot add an algorithm with field parameters',
      mochaAsync(async () => {
        const { client } = app;

        // add algorithm
        await clickAddButton(client);
        await addAlgorithmFromEditor(
          client,
          ALGORITHM_WITH_NO_SCHEMA_FIELD_SELECTORS,
        );
        await addParameters(client, ALGORITHM_WITH_NO_SCHEMA_FIELD_SELECTORS);

        // should display error alert
        await client.expectElementToExist(
          `#${ALERT_FIELD_SELECTOR_NO_SCHEMA_AVAILABLE_ID}`,
        );
      }),
    );
  });
});
