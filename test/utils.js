/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
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
  if (await drawerButton.isClickable()) {
    await drawerButton.click();
  }
  await client.pause(OPEN_DRAWER_PAUSE);
};

export const expectElementToExist = async (client, elementSelector) => {
  const el = await client.$(elementSelector);
  const found = await el.isExisting();
  if (!found) {
    /* eslint-disable-next-line no-console */
    console.log(`${elementSelector} is not found`);
  }
  expect(found).to.be.true;
};

export const expectElementToNotExist = async (client, elementSelector) => {
  const el = await client.$(elementSelector);
  const found = await el.isExisting();
  expect(found).to.be.false;
};
