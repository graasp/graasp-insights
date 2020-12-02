import { Application } from 'spectron';
import electronPath from 'electron'; // Require Electron from the binaries included in node_modules.
import path from 'path';
import fse from 'fs-extra';
import { setUpClientCommands } from './commands';

export const getVarFolder = () => {
  const today = new Date();
  const y = today.getFullYear();
  // JavaScript months are 0-based.
  const m = today.getMonth() + 1;
  const d = today.getDate();
  const h = today.getHours();
  const mi = today.getMinutes();
  const s = today.getSeconds();
  const time = `${y}${m}${d}_${h}-${mi}-${s}`;
  return path.join(__dirname, 'tmp', time);
};

// eslint-disable-next-line no-unused-vars
const setUpDatabase = async (database = {}, varFolderPath) => {
  const tmpDatabasePath = varFolderPath || getVarFolder();
  const varFolder = path.join(tmpDatabasePath, 'var');
  fse.ensureDirSync(`${varFolder}/datasets`);
  fse.ensureDirSync(`${varFolder}/algorithms`);

  if (Object.keys(database).length !== 0) {
    const { datasets = [], algorithms = [] } = database;
    // eslint-disable-next-line no-restricted-syntax
    for (const dataset of datasets) {
      const dest = `${varFolder}/datasets/${dataset.id}.json`;
      fse.copyFileSync(dataset.filepath, dest);
      dataset.filepath = dest;
    }
    // eslint-disable-next-line no-restricted-syntax
    for (const algorithm of algorithms) {
      const dest = `${varFolder}/algorithms/${algorithm.id}.py`;
      fse.copyFileSync(algorithm.filepath, dest);
      algorithm.filepath = dest;
      algorithm.filename = algorithm.id;
    }
    fse.writeFileSync(`${varFolder}/db.json`, JSON.stringify(database));
  }

  return tmpDatabasePath;
};

const createApplication = async ({ database, varFolder } = {}) => {
  const env = { NODE_ENV: 'test', ELECTRON_IS_DEV: 0 };

  // set up database
  const tmpDatabasePath = await setUpDatabase(database, varFolder);

  const app = new Application({
    // Your electron path can be any binary
    // i.e for OSX an example path could be '/Applications/MyApp.app/Contents/MacOS/MyApp'
    // But for the sake of the example we fetch it from our node_modules.
    path: electronPath,

    // Assuming you have the following directory structure

    //  |__ my project
    //     |__ ...
    //     |__ main.js
    //     |__ package.json
    //     |__ index.html
    //     |__ ...
    //     |__ test
    //        |__ spec.js  <- You are here! ~ Well you should be.

    // The following line tells spectron to look and use the main.js file
    // and the package.json located 1 level above.
    args: [path.join(__dirname, '../public/electron.js')],
    chromeDriverArgs: [`--user-data-dir=${tmpDatabasePath}`],
    env,
  });

  await app.start();

  setUpClientCommands(app);
  await app.client.pause(1000);
  return app;
};

const closeApplication = async (app) => {
  if (!app || !app.isRunning()) return;
  await app.stop();
};

export { createApplication, closeApplication };
