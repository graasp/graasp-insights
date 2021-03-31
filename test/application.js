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

const setUpDatabase = async (database = {}, varFolderPath) => {
  const tmpDatabasePath = varFolderPath || getVarFolder();
  const varFolder = path.join(tmpDatabasePath, 'var');
  fse.ensureDirSync(`${varFolder}/datasets`);
  fse.ensureDirSync(`${varFolder}/algorithms`);

  if (Object.keys(database).length !== 0) {
    const {
      datasets: originalDatasets = [],
      algorithms: originalAlgorithms = [],
      schemas: originalSchemas = [],
      pipelines = [],
    } = database;
    const datasets = JSON.parse(JSON.stringify(originalDatasets || []));
    for (const dataset of datasets) {
      const dest = `${varFolder}/datasets/${dataset.id}.json`;
      fse.copyFileSync(dataset.filepath, dest);
      dataset.filepath = dest;
    }
    const algorithms = JSON.parse(JSON.stringify(originalAlgorithms || []));
    for (const algorithm of algorithms) {
      const dest = `${varFolder}/algorithms/${algorithm.id}.py`;
      fse.copyFileSync(algorithm.filepath, dest);
      algorithm.filepath = dest;
      algorithm.filename = algorithm.id;
    }

    const schemas = {};
    for (const schema of originalSchemas) {
      schemas[schema.id] = schema;
    }

    const newDatabase = {
      datasets,
      algorithms,
      pipelines,
      schemas,
    };

    fse.writeFileSync(`${varFolder}/db.json`, JSON.stringify(newDatabase));
  }

  return tmpDatabasePath;
};

const createApplication = async ({
  database,
  responses = {
    showMessageDialogResponse: undefined,
    showSaveDialogResponse: undefined,
    showOpenDialogResponse: undefined,
    showTours: 0,
  },
  varFolder,
} = {}) => {
  const {
    showMessageDialogResponse,
    showSaveDialogResponse,
    showOpenDialogResponse,
  } = responses;

  const env = { NODE_ENV: 'test', ELECTRON_IS_DEV: 0 };

  if (showMessageDialogResponse !== undefined) {
    env.SHOW_MESSAGE_DIALOG_RESPONSE = showMessageDialogResponse;
  }

  if (showSaveDialogResponse !== undefined) {
    env.SHOW_SAVE_DIALOG_RESPONSE = showSaveDialogResponse;
  }

  if (showOpenDialogResponse !== undefined) {
    env.SHOW_OPEN_DIALOG_RESPONSE = showOpenDialogResponse;
  }

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
