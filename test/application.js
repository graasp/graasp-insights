import { Application } from 'spectron';
import electronPath from 'electron'; // Require Electron from the binaries included in node_modules.
import path from 'path';

const createApplication = async () => {
  const env = { NODE_ENV: 'test', ELECTRON_IS_DEV: 0 };

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
    env,
  });

  await app.start();
  await app.client.pause(1000);
  return app;
};

const closeApplication = async (app) => {
  if (!app || !app.isRunning()) return;
  await app.stop();
};

export { createApplication, closeApplication };
