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
  ALGORITHMS_FOLDER,
  escapeEscapeCharacter,
} = require('./app/config/config');
const isMac = require('./app/utils/isMac');
const {
  LOAD_DATASET_CHANNEL,
  GET_DATASET_CHANNEL,
  GET_DATASETS_CHANNEL,
  GET_DATABASE_CHANNEL,
  SET_SAMPLE_DATABASE_CHANNEL,
  SET_DATABASE_CHANNEL,
  DELETE_DATASET_CHANNEL,
  SET_LANGUAGE_CHANNEL,
  GET_LANGUAGE_CHANNEL,
  DELETE_RESULT_CHANNEL,
  GET_RESULTS_CHANNEL,
  GET_RESULT_CHANNEL,
  GET_ALGORITHMS_CHANNEL,
  GET_ALGORITHM_CHANNEL,
  DELETE_ALGORITHM_CHANNEL,
  EXPORT_DATASET_CHANNEL,
  EXECUTE_PYTHON_ALGORITHM_CHANNEL,
  CHECK_PYTHON_INSTALLATION_CHANNEL,
  SHOW_SAVE_AS_PROMPT_CHANNEL,
  EXPORT_RESULT_CHANNEL,
  SAVE_ALGORITHM_CHANNEL,
  ADD_ALGORITHM_CHANNEL,
  BROWSE_FILE_CHANNEL,
} = require('./shared/channels');
const { APP_BACKGROUND_COLOR } = require('./shared/constants');
const {
  loadDataset,
  executePythonAlgorithm,
  getDataset,
  getDatasets,
  setDatabase,
  deleteDataset,
  setSampleDatabase,
  getLanguage,
  setLanguage,
  getResult,
  getResults,
  deleteResult,
  getAlgorithms,
  deleteAlgorithm,
  getDatabase,
  checkPythonInstallation,
  exportDataset,
  showSaveAsPrompt,
  exportResult,
  setDatasetFile,
  getAlgorithm,
  saveAlgorithm,
  addAlgorithm,
  browseFile,
} = require('./app/listeners');
const env = require('./env.json');
const {
  ensureDatabaseExists,
  bootstrapDatabase,
  ensureAlgorithmsExist,
} = require('./app/db');
const { SET_DATASET_FILE_CHANNEL } = require('../src/shared/channels');

// add keys to process
Object.keys(env).forEach((key) => {
  process.env[key] = env[key];
});

let mainWindow;

const createWindow = () => {
  logger.debug('create window');

  mainWindow = new BrowserWindow({
    backgroundColor: APP_BACKGROUND_COLOR,
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
  await ensureAlgorithmsExist(db, ALGORITHMS_FOLDER);

  createWindow();
  generateMenu();

  ipcMain.on(SHOW_SAVE_AS_PROMPT_CHANNEL, showSaveAsPrompt(mainWindow));

  // called when getting datasets
  ipcMain.on(GET_DATASETS_CHANNEL, getDatasets(mainWindow, db));

  // called when getting a dataset
  ipcMain.on(GET_DATASET_CHANNEL, getDataset(mainWindow, db));

  ipcMain.on(LOAD_DATASET_CHANNEL, loadDataset(mainWindow, db));

  // called when deleting a dataset
  ipcMain.on(DELETE_DATASET_CHANNEL, deleteDataset(mainWindow, db));

  // called when exporting a dataset
  ipcMain.on(EXPORT_DATASET_CHANNEL, exportDataset(mainWindow, db));

  ipcMain.on(SET_DATASET_FILE_CHANNEL, setDatasetFile(mainWindow, db));

  // called when getting results
  ipcMain.on(GET_RESULTS_CHANNEL, getResults(mainWindow, db));

  // called when getting a result
  ipcMain.on(GET_RESULT_CHANNEL, getResult(mainWindow, db));

  // called when deleting a result
  ipcMain.on(DELETE_RESULT_CHANNEL, deleteResult(mainWindow, db));

  // called when deleting a dataset
  ipcMain.on(EXPORT_RESULT_CHANNEL, exportResult(mainWindow, db));

  ipcMain.on(
    EXECUTE_PYTHON_ALGORITHM_CHANNEL,
    executePythonAlgorithm(mainWindow, db),
  );

  // called when getting the database
  ipcMain.on(GET_DATABASE_CHANNEL, getDatabase(mainWindow, db));

  // called when setting the sample database
  ipcMain.on(SET_SAMPLE_DATABASE_CHANNEL, setSampleDatabase(mainWindow, db));

  // called when setting the database
  ipcMain.on(SET_DATABASE_CHANNEL, setDatabase(mainWindow, db));

  ipcMain.on(SET_LANGUAGE_CHANNEL, setLanguage(mainWindow, db));

  ipcMain.on(GET_LANGUAGE_CHANNEL, getLanguage(mainWindow, db));
  // called when getting all the algorithms
  ipcMain.on(GET_ALGORITHMS_CHANNEL, getAlgorithms(mainWindow, db));

  // called when deleting an algorithm
  ipcMain.on(DELETE_ALGORITHM_CHANNEL, deleteAlgorithm(mainWindow, db));

  ipcMain.on(
    CHECK_PYTHON_INSTALLATION_CHANNEL,
    checkPythonInstallation(mainWindow, db),
  );
  // called when getting an algorithm
  ipcMain.on(GET_ALGORITHM_CHANNEL, getAlgorithm(mainWindow, db));

  // called when saving an algorithm
  ipcMain.on(SAVE_ALGORITHM_CHANNEL, saveAlgorithm(mainWindow, db));

  // called when adding an algorithm
  ipcMain.on(ADD_ALGORITHM_CHANNEL, addAlgorithm(mainWindow, db));

  // called when browsing a file
  ipcMain.on(BROWSE_FILE_CHANNEL, browseFile(mainWindow));
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on('load-page', (event, arg) => {
  mainWindow.loadURL(arg);
});
