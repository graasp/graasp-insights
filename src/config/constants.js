import { PARAMETER_TYPES } from '../shared/constants';

export const DATASETS_COLLECTION = 'datasets';

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
  JSON: { name: 'JSON', extensions: ['json'] },
  ALL: { name: 'All files', extensions: ['*'] },
};

export const EDITOR_PROGRAMMING_LANGUAGES = {
  PYTHON: 'python',
};

export const ADD_OPTIONS = {
  FILE: 'file',
  EDITOR: 'editor',
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

export const FILE_SIZE_LIMIT_OPTIONS = [0, 500, 1000, 2500, 5000, 10000];
export const DEFAULT_FILE_SIZE_LIMIT = FILE_SIZE_LIMIT_OPTIONS[2];

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
