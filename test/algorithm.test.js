/* eslint-disable no-unused-expressions */
/* eslint-disable no-restricted-syntax */
/* eslint-disable func-names */
import { expect } from 'chai';
import { mochaAsync, openDrawer } from './utils';
import {
  ALGORITHMS_MENU_ITEM_ID,
  ALGORITHM_TABLE_ID,
  ALGORITHM_NAME_CLASS,
  ALGORITHM_DESCRIPTION_CLASS,
  ALGORITHM_AUTHOR_CLASS,
  ALGORITHM_LANGUAGE_CLASS,
  ALGORITHM_DELETE_CLASS,
  buildAlgorithmRowClass,
} from '../src/config/selectors';
import { createApplication, closeApplication } from './application';
import { DEFAULT_GLOBAL_TIMEOUT } from './constants';
import { GRAASP_ALGORITHMS } from './fixtures/algorithms/algorithms';

const menuGoTo = async (client, selector) => {
  await openDrawer(client);
  const el = await client.$(selector);
  await el.click();
};

const verifyAlgorithm = async (client, algorithm) => {
  const { name, description, author, language } = algorithm;

  const matchedAlgorithm = await client.$(
    `#${ALGORITHM_TABLE_ID} .${buildAlgorithmRowClass(name)}`,
  );

  expect(
    await (await matchedAlgorithm.$(`.${ALGORITHM_NAME_CLASS}`)).getText(),
  ).to.equal(name);
  expect(
    await (
      await matchedAlgorithm.$(`.${ALGORITHM_DESCRIPTION_CLASS}`)
    ).getText(),
  ).to.equal(description.replace(/\s+/g, ' '));
  expect(
    await (await matchedAlgorithm.$(`.${ALGORITHM_AUTHOR_CLASS}`)).getText(),
  ).to.equal(author);
  expect(
    await (await matchedAlgorithm.$(`.${ALGORITHM_LANGUAGE_CLASS}`)).getText(),
  ).to.equal(language);
};

describe('Algorithms Scenarios', function () {
  this.timeout(DEFAULT_GLOBAL_TIMEOUT);
  let app = null;

  beforeEach(
    mochaAsync(async () => {
      app = await createApplication();
    }),
  );

  afterEach(() => {
    return closeApplication(app);
  });

  it(
    'Correctly adds Graasp algorithms',
    mochaAsync(async () => {
      const { client } = app;

      await menuGoTo(client, `#${ALGORITHMS_MENU_ITEM_ID}`);

      for (const algorithm of GRAASP_ALGORITHMS) {
        // eslint-disable-next-line no-await-in-loop
        await verifyAlgorithm(client, algorithm);
      }
    }),
  );

  it(
    'Correctly deletes algorithms',
    mochaAsync(async () => {
      const { client } = app;

      await menuGoTo(client, `#${ALGORITHMS_MENU_ITEM_ID}`);

      const nAlgosPrior = (
        await client.$$(`#${ALGORITHM_TABLE_ID} .${ALGORITHM_NAME_CLASS}`)
      ).length;
      expect(nAlgosPrior > 0).to.be.true;

      const deleteButton = await client.$(
        `#${ALGORITHM_TABLE_ID} .${ALGORITHM_DELETE_CLASS}`,
      );
      await deleteButton.click();

      const nAlgosAfter = (
        await client.$$(`#${ALGORITHM_TABLE_ID} .${ALGORITHM_NAME_CLASS}`)
      ).length;
      expect(nAlgosPrior - nAlgosAfter).to.equal(1);
    }),
  );
});
