/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable func-names */
import { mochaAsync, openDrawer } from './utils';
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

  afterEach(() => {
    return closeApplication(app);
  });

  it(
    'displays correct navigation',
    mochaAsync(async () => {
      const { client } = app;
      await openDrawer(client);
      await client.expectElementToExist(`#${DATASETS_MENU_ITEM_ID}`);
      await client.expectElementToExist(`#${ALGORITHMS_MENU_ITEM_ID}`);
      await client.expectElementToExist(`#${QUIT_MENU_ITEM_ID}`);
    }),
  );
});
