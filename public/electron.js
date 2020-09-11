const {
  app,
  BrowserWindow,
  shell,
  ipcMain,
  Menu,
  // eslint-disable-next-line import/no-extraneous-dependencies
} = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const openAboutWindow = require('about-window').default;
const logger = require('./app/logger');
const {
  ICON_PATH,
  PRODUCT_NAME,
  DATABASE_PATH,
  escapeEscapeCharacter,
} = require('./app/config/config');
const isMac = require('./app/utils/isMac');
const {
  SHOW_LOAD_DATASET_PROMPT_CHANNEL,
  LOAD_DATASET_CHANNEL,
  EXECUTE_PYTHON_ALGORITHM_CHANNEL,
  GET_DATASET_CHANNEL,
  GET_DATASETS_CHANNEL,
  GET_DATABASE_CHANNEL,
  SET_SAMPLE_DATABASE_CHANNEL,
  SET_DATABASE_CHANNEL,
} = require('./app/config/channels');
const {
  showLoadDatasetPrompt,
  loadDataset,
  executePythonAlgorithm,
  getDataset,
  getDatasets,
  setDatabase,
} = require('./app/listeners');
const env = require('./env.json');
const { ensureDatabaseExists, bootstrapDatabase } = require('./app/db');
const sampleDatabase = require('./app/data/sample');

// add keys to process
Object.keys(env).forEach((key) => {
  process.env[key] = env[key];
});

let mainWindow;

const createWindow = () => {
  logger.debug('create window');

  mainWindow = new BrowserWindow({
    backgroundColor: '#F7F7F7',
    minWidth: 880,
    show: false,
    movable: true,
    webPreferences: {
      nodeIntegration: false,
      preload: `${__dirname}/app/preload.js`,
      webSecurity: false,
    },
    height: 860,
    width: 1280,
  });

  mainWindow.loadURL(
    isDev || process.env.NODE_ENV === 'test'
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, './index.html')}`,
  );

  if (isDev) {
    const {
      default: installExtension,
      REACT_DEVELOPER_TOOLS,
      REDUX_DEVTOOLS,
      // eslint-disable-next-line global-require
    } = require('electron-devtools-installer');

    installExtension(REACT_DEVELOPER_TOOLS)
      .then((name) => {
        logger.info(`added extension: ${name}`);
      })
      .catch((err) => {
        logger.error(err);
      });

    installExtension(REDUX_DEVTOOLS)
      .then((name) => {
        logger.info(`added extension: ${name}`);
      })
      .catch((err) => {
        logger.error(err);
      });
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();

    ipcMain.on('open-external-window', (event, arg) => {
      shell.openExternal(arg);
    });
  });
};

const macAppMenu = [
  {
    label: app.name,
    submenu: [
      { role: 'about' },
      { type: 'separator' },
      { role: 'services' },
      { type: 'separator' },
      { role: 'hide' },
      { role: 'hideothers' },
      { role: 'unhide' },
      { type: 'separator' },
      { role: 'quit' },
    ],
  },
];
const standardAppMenu = [];
const macFileSubmenu = [{ role: 'close' }];
const standardFileSubmenu = [
  {
    label: 'About',
    click: () => {
      const year = new Date().getFullYear();
      openAboutWindow({
        // asset for icon is in the public/assets folder
        base_path: escapeEscapeCharacter(app.getAppPath()),
        icon_path: path.join(__dirname, ICON_PATH),
        copyright: `Copyright © ${year} EPFL\nCopyright © ${year} Graasp Association`,
        product_name: PRODUCT_NAME,
        use_version_info: false,
        adjust_window_size: true,
        win_options: {
          parent: mainWindow,
          resizable: false,
          minimizable: false,
          maximizable: false,
          movable: true,
          frame: true,
        },
        // automatically show info from package.json
        package_json_dir: path.join(__dirname, '../'),
        bug_link_text: 'Report a Bug/Issue',
        // we cannot use homepage from package.json as
        // create-react-app uses it to build the frontend
        homepage: 'https://graasp.org/',
      });
    },
  },
  { role: 'quit' },
];

const learnMoreLink =
  'https://github.com/graasp/graasp-insights/blob/master/README.md';
const fileIssueLink = 'https://github.com/graasp/graasp-insights/issues';

const generateMenu = () => {
  const template = [
    ...(isMac() ? macAppMenu : standardAppMenu),
    {
      label: 'File',
      submenu: [...(isMac() ? macFileSubmenu : standardFileSubmenu)],
    },
    { type: 'separator' },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectAll' },
      ],
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forcereload' },
        { role: 'toggledevtools' },
        { type: 'separator' },
        { role: 'resetzoom' },
        { role: 'zoomin' },
        { role: 'zoomout' },
        { type: 'separator' },
        { role: 'togglefullscreen' },
      ],
    },
    {
      role: 'window',
      submenu: [
        { role: 'minimize' },
        { role: 'zoom' },
        ...(isMac()
          ? [
              { type: 'separator' },
              { role: 'front' },
              { type: 'separator' },
              { role: 'window' },
            ]
          : [{ role: 'close' }]),
      ],
    },
    {
      role: 'help',
      submenu: [
        {
          click() {
            // eslint-disable-next-line
            require('electron').shell.openExternal(learnMoreLink);
          },
          label: 'Learn More',
        },
        {
          click() {
            // eslint-disable-next-line
            require('electron').shell.openExternal(fileIssueLink);
          },
          label: 'File Issue on GitHub',
        },
      ],
    },
  ];

  if (isMac()) {
    Menu.setApplicationMenu(Menu.buildFromTemplate(template));
  } else {
    // this causes the menu to change on mac after first use
    // and it's no longer possible to use the mac defaults
    Menu.setApplicationMenu(null);
    mainWindow.setMenu(Menu.buildFromTemplate(template));
  }
};

app.on('ready', async () => {
  await ensureDatabaseExists(DATABASE_PATH);
  const db = bootstrapDatabase(DATABASE_PATH);

  createWindow();
  generateMenu();
  // prompt when loading a dataset
  ipcMain.on(
    SHOW_LOAD_DATASET_PROMPT_CHANNEL,
    showLoadDatasetPrompt(mainWindow),
  );

  // called when getting datasets
  ipcMain.on(GET_DATASETS_CHANNEL, getDatasets(mainWindow, db));

  // called when getting a dataset
  ipcMain.on(GET_DATASET_CHANNEL, getDataset(mainWindow, db));

  ipcMain.on(LOAD_DATASET_CHANNEL, loadDataset(mainWindow, db));

  ipcMain.on(
    EXECUTE_PYTHON_ALGORITHM_CHANNEL,
    executePythonAlgorithm(mainWindow, db),
  );

  // called when getting the database
  ipcMain.on(GET_DATABASE_CHANNEL, async () => {
    try {
      const database = db.getState();
      mainWindow.webContents.send(GET_DATABASE_CHANNEL, database);
    } catch (err) {
      logger.error(err);
      mainWindow.webContents.send(GET_DATABASE_CHANNEL, null);
    }
  });

  // called when setting the sample database
  ipcMain.on(SET_SAMPLE_DATABASE_CHANNEL, async (e) => {
    setDatabase(mainWindow, db)(e, {
      payload: sampleDatabase,
      channel: SET_SAMPLE_DATABASE_CHANNEL,
    });
  });

  // called when setting the database
  ipcMain.on(SET_DATABASE_CHANNEL, (e, payload) => {
    setDatabase(mainWindow, db)(e, { payload, channel: SET_DATABASE_CHANNEL });
  });
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on('load-page', (event, arg) => {
  mainWindow.loadURL(arg);
});
