import { SCHEMA_TYPES } from '../shared/constants';
import theme from '../theme';

export const DATASETS_COLLECTION = 'datasets';
export const SETTINGS_COLLECTION = 'settings';

export const DEFAULT_LANGUAGE = 'en';
export const DEFAULT_PROTOCOL = 'https';

export const DRAWER_WIDTH = 240;
export const DRAWER_HEADER_HEIGHT = 55;

export const ORDER_BY = {
  ASC: 'asc',
  DESC: 'desc',
};

export const MAX_FILE_SIZE = 1000;

export const DEFAULT_LOCALE_DATE = 'en-US';

export const PROGRAMMING_LANGUAGES = {
  PYTHON: 'Python',
};

export const AUTHOR_GRAASP = 'Graasp';
export const AUTHOR_USER = 'User';

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

export const SCHEMA_LABELS = {
  [SCHEMA_TYPES.GRAASP]: 'Graasp',
};

export const SCHEMA_COLORS = {
  [SCHEMA_TYPES.GRAASP]: {
    backgroundColor: theme.palette.primary.main,
    color: 'white',
  },
};

export const SCHEMA_TOOLTIPS = {
  [SCHEMA_TYPES.GRAASP]: 'Graasp dataset detected',
};
