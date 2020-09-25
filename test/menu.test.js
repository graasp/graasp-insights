/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable func-names */
import { mochaAsync, openDrawer, expectElementToExist } from './utils';
import { createApplication, closeApplication } from './application';
import { DEFAULT_GLOBAL_TIMEOUT } from './constants';
import {
  QUIT_MENU_ITEM_ID,
  ALGORITHMS_MENU_ITEM_ID,
  DATASETS_MENU_ITEM_ID,
} from '../src/config/selectors';

describe('Menu Scenarios', function () {
  this.timeout(DEFAULT_GLOBAL_TIMEOUT);
  let app = null;

  beforeEach(
    mochaAsync(async () => {
      app = await createApplication();
    }),
  );

  afterEach(function () {
    return closeApplication(app);
  });

  it(
    'displays correct navigation',
    mochaAsync(async () => {
      const { client } = app;
      await openDrawer(client);
      await expectElementToExist(client, `#${DATASETS_MENU_ITEM_ID}`);
      await expectElementToExist(client, `#${ALGORITHMS_MENU_ITEM_ID}`);
      await expectElementToExist(client, `#${QUIT_MENU_ITEM_ID}`);
    }),
  );
});
