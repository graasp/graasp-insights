import hexRgb from 'hex-rgb';
import { PARAMETER_TYPES, FILE_FORMATS } from '../shared/constants';
import theme from '../theme';
import { generateTextColorFromBackground } from '../utils/color';

export const NOTIFICATIONS_TYPES = {
  TOASTR: 'toastr',
};

export const SHOW_NOTIFICATIONS =
  process?.env?.REACT_APP_SHOW_NOTIFICATIONS || false;

export const DEFAULT_LANGUAGE = 'en';
export const DEFAULT_PROTOCOL = 'https';

export const DRAWER_WIDTH = 240;
export const DRAWER_HEADER_HEIGHT = 55;

export const ORDER_BY = {
  ASC: 'asc',
  DESC: 'desc',
};

export const DEFAULT_LOCALE_DATE = 'en-US';

export const DEFAULT_NUMBER_FORMAT = 'en';

export const FILE_FILTERS = {
  PYTHON: { name: 'Python', extensions: ['py', 'pyx'] },
  JSON: { name: 'JSON', extensions: [FILE_FORMATS.JSON] },
  CSV: { name: 'CSV', extensions: [FILE_FORMATS.CSV] },
  XLSX: { name: 'XLSX', extensions: [FILE_FORMATS.XLSX] },
  ALL_SUPPORTED_FORMATS: {
    name: 'Supported datasets (*.json;*.csv;*.xlsx)',
    extensions: [FILE_FORMATS.JSON, FILE_FORMATS.CSV, FILE_FORMATS.XLSX],
  },
  ALL_FILES: { name: 'All files', extensions: ['*'] },
};

export const EDITOR_PROGRAMMING_LANGUAGES = {
  PYTHON: 'python',
};

export const ADD_OPTIONS = {
  FILE: 'file',
  EDITOR: 'editor',
  DEFAULT: 'default',
};

// Default latitude and longitude for centering map in ActionsMap.js. Zurich coordinates used below.
export const DEFAULT_LATITUDE = 47.3769;
export const DEFAULT_LONGITUDE = 8.5417;

// Default Zoom for map in ActionsMap.js
export const DEFAULT_ZOOM = 3;

// If user zooms in beyond MAX_CLUSTER_ZOOM, map no longer displays data points.
// Maximum possible value is 16 (zoomed all the way in). See npm supercluster docs for further info.
export const MAX_CLUSTER_ZOOM = 12;

// Size (in pixels) of cluster zones used by supercluster.
// The higher CLUSTER_RADIUS, the more map area absorbed into a single cluster.
export const CLUSTER_RADIUS = 75;

// Key code for the Enter/Return key (Used in a placeholder keyboard event listener in ActionsMap)
export const ENTER_KEY_CODE = 13;

// height of container in ActionsByDayChart, ActionsByTimeOfDayChart, ActionsByVerbChart
export const CONTAINER_HEIGHT = 450;

// strings used in components/charts/custom/CustomTooltip to generate added tooltip text in ActionsByTimeOfDayChart
export const LATE_NIGHT = 'Late night';
export const EARLY_MORNING = 'Early morning';
export const MORNING = 'Morning';
export const AFTERNOON = 'Afternoon';
export const EVENING = 'Evening';
export const NIGHT = 'Night';

// Used in /utils/charts.js, to filter out the auto-generated 'user' with name 'Learning Analytics'
export const LEARNING_ANALYTICS_USER_ID = '5405e202da3a95cf9050e8f9';

// Used in /utils/charts.js and then the ActionsByVerb piechart
// for visual purposes, all verbs with < 3 percent of total actions are consolidated into an entry 'other'
export const MIN_PERCENTAGE_TO_SHOW_VERB = 3;

// 'other' verb used in /utils/charts.js
export const OTHER_VERB = 'Other';

// colors used to fill the segments of the ActionsByVerb piechart
export const COLORS = [
  '#3066BE',
  '#96CCE6',
  '#20A39E',
  '#61D095',
  '#FFBA49',
  '#EF5B5B',
  '#FFA8A8',
  '#A4036F',
  '#B54A3F',
  '#FFFFAF',
];

// used to define yaxis and xaxis tick sizes in ActionsByDayChart and ActionsByTimeOfDayChart
export const TICK_FONT_SIZE = 14;

export const UTILS_FILES = {
  GRAASP: 'graasp',
  USER: 'user',
};

export const CIRCLE_PROGRESS_SIZE = 26;

export const PARAMETER_TYPES_PYTHON = {
  [PARAMETER_TYPES.FIELD_SELECTOR]: 'str',
  [PARAMETER_TYPES.FLOAT_INPUT]: 'float',
  [PARAMETER_TYPES.INTEGER_INPUT]: 'int',
  [PARAMETER_TYPES.STRING_INPUT]: 'str',
};

export const PARAMETER_TYPES_DEFAULT = {
  // the field selector is consituted of key value pairs { schemaId, fieldSelection }
  [PARAMETER_TYPES.FIELD_SELECTOR]: {},
  [PARAMETER_TYPES.FLOAT_INPUT]: 0.0,
  [PARAMETER_TYPES.INTEGER_INPUT]: 0,
  [PARAMETER_TYPES.STRING_INPUT]: '',
};

// used in UsersSelect dropdown, if a string is too long (which occurs when user Ids are hashed)
export const MAX_STRING_DISPLAYED_LENGTH = 25;
export const ABBREVIATED_STRING_LENGTH = 10;

export const DEFAULT_TAG_STYLE = {
  backgroundColor: theme.palette.gray.main,
  color: generateTextColorFromBackground(
    hexRgb(theme.palette.gray.main, { format: 'array' }),
  ),
};

export const MAX_SHOWN_SCHEMA_TAGS = 3;

export const JSON_SCHEMA_GETTING_STARTED_URL =
  'https://json-schema.org/learn/getting-started-step-by-step.html';

export const RADIX_DECIMAL = 10;

export const ROWS_PER_PAGE_OPTIONS = [5, 10, 25];

export const DEFAULT_ROWS_PER_PAGE = ROWS_PER_PAGE_OPTIONS[1];

export const DATASET_CONTENT_VIEW_MODES = {
  RAW: 'raw',
  TABLE: 'table',
};
