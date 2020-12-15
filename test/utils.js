/* eslint-disable no-unused-expressions */
import { DRAWER_BUTTON_ID } from '../src/config/selectors';
import { OPEN_DRAWER_PAUSE } from './constants';

/** util function to deal with asynchronous tests */
export const mochaAsync = (fn) => {
  return (done) => {
    fn.call().then(done, (err) => {
      done(err);
    });
  };
};

export const openDrawer = async (client) => {
  const drawerButton = await client.$(`#${DRAWER_BUTTON_ID}`);
  if (await drawerButton.isDisplayed()) {
    await drawerButton.click();
  }
  await client.pause(OPEN_DRAWER_PAUSE);
};

export const clearInput = async (elem) => {
  const value = await elem.getValue();
  const backSpaces = new Array(value.length).fill('Backspace');
  await elem.setValue(backSpaces);
};

export const menuGoTo = async (client, selector) => {
  await openDrawer(client);
  const el = await client.$(selector);
  await el.click();
};
