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
  if (await client.isVisible(`#${DRAWER_BUTTON_ID}`)) {
    await client.click(`#${DRAWER_BUTTON_ID}`);
  }
  await client.pause(OPEN_DRAWER_PAUSE);
};

export const expectElementToExist = async (client, elementSelector) => {
  const found = await client.isExisting(elementSelector);
  if (!found) {
    /* eslint-disable-next-line no-console */
    console.log(`${elementSelector} is not found`);
  }
  expect(found).to.be.true;
};

export const expectElementToNotExist = async (client, elementSelector) => {
  const found = await client.isExisting(elementSelector);
  expect(found).to.be.false;
};
