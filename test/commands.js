/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import {
  ALGORITHMS_MENU_ITEM_ID,
  DATASETS_MENU_ITEM_ID,
  EXECUTIONS_MENU_ITEM_ID,
  QUIT_MENU_ITEM_ID,
  RESULTS_MENU_ITEM_ID,
  SCHEMAS_MENU_ITEM_ID,
  SETTINGS_MENU_ITEM_ID,
} from '../src/config/selectors';
import { openDrawer } from './utils';

// eslint-disable-next-line import/prefer-default-export
export const setUpClientCommands = ({ client }) => {
  client.addCommand('goTo', async (menuItemId) => {
    // open menu if it is closed
    await openDrawer(client);
    const menuItem = await client.$(`#${menuItemId}`);
    await menuItem.click();
  });

  client.addCommand('goToDatasets', async () => {
    await client.goTo(DATASETS_MENU_ITEM_ID);
  });

  client.addCommand('goToAlgorithms', async () => {
    await client.goTo(ALGORITHMS_MENU_ITEM_ID);
  });

  client.addCommand('goToExecutions', async () => {
    await client.goTo(EXECUTIONS_MENU_ITEM_ID);
  });

  client.addCommand('goToResults', async () => {
    await client.goTo(RESULTS_MENU_ITEM_ID);
  });

  client.addCommand('quit', async () => {
    await client.goTo(QUIT_MENU_ITEM_ID);
  });

  client.addCommand('goToSettings', async () => {
    await client.goTo(SETTINGS_MENU_ITEM_ID);
  });

  client.addCommand('goToSchemas', async () => {
    await client.goTo(SCHEMAS_MENU_ITEM_ID);
  });

  client.addCommand('expectElementToExist', async (elementSelector) => {
    const el = await client.$(elementSelector);
    const found = await el.isExisting();
    if (!found) {
      /* eslint-disable-next-line no-console */
      console.debug(`${elementSelector} is not found`);
    }
    expect(found).to.be.true;
  });

  client.addCommand(
    'expectElementToNotExist',
    async (containerSelector, elementSelector) => {
      const found = await (await client.$(containerSelector)).getHTML();
      expect(found).to.not.contain(elementSelector);
    },
  );
};
