const _ = require('lodash');
const {
  LEARNING_ANALYTICS_USER_ID,
  MIN_PERCENTAGE_TO_SHOW_VERB,
  OTHER_VERB,
  LATE_NIGHT,
  EARLY_MORNING,
  MORNING,
  AFTERNOON,
  EVENING,
  NIGHT,
  MAX_STRING_DISPLAYED_LENGTH,
  ABBREVIATED_STRING_LENGTH,
} = require('../config/constants');

// Takes array of action objects and returns an object with {key: value} pairs of {date: #-of-actions}
export const getActionsByDay = (actions) => {
  const actionsByDay = {};
  actions.forEach((action) => {
    const actionDate = new Date(action.createdAt.slice(0, 10));
    if (!actionsByDay[actionDate]) {
      actionsByDay[actionDate] = 1;
    } else {
      actionsByDay[actionDate] += 1;
    }
  });
  return actionsByDay;
};

// Takes object with {key: value} pairs of {date: #-of-actions} and returns a date-sorted array in Recharts.js format
export const formatActionsByDay = (actionsByDayObject) => {
  const actionsByDayArray = Object.entries(actionsByDayObject);
  const sortedActionsByDay = actionsByDayArray.sort(
    (entryA, entryB) => Date.parse(entryA[0]) - Date.parse(entryB[0]),
  );
  return sortedActionsByDay.map(([date, count]) => {
    const entryDate = new Date(date);
    return {
      date: `${entryDate.getDate()}-${
        entryDate.getMonth() + 1
      }-${entryDate.getFullYear()}`,
      count,
    };
  });
};

// given an actionsByDay object, finds max value to set on the yAxis in the graph in ActionsByDayChart.js
export const findYAxisMax = (actionsByDay) => {
  const arrayOfActionsCount = Object.values(actionsByDay);
  if (!arrayOfActionsCount.length) {
    return null;
  }
  const maxActionsCount = arrayOfActionsCount.reduce((a, b) => Math.max(a, b));
  let yAxisMax;
  // if maxActionsCount <= 100, round up yAxisMax to the nearest ten; else, to the nearest hundred
  if (maxActionsCount <= 100) {
    yAxisMax = Math.ceil(maxActionsCount / 10) * 10;
  } else {
    yAxisMax = Math.ceil(maxActionsCount / 100) * 100;
  }
  return yAxisMax;
};

// helper function used in getActionsByTimeOfDay
// todo: update this function to retrieve hour of day using JS Date objects/moment
const getActionHourOfDay = (action) => {
  // expects action to be an object with a createdAt key
  // createdAt should have the format "2020-12-31T23:59:59.999Z"
  return action.createdAt.slice(11, 13);
};

// Takes array of action objects and returns an object with {key: value} pairs of {hourOfDay: #-of-actions}
export const getActionsByTimeOfDay = (actions) => {
  const actionsByTimeOfDay = {
    [LATE_NIGHT]: 0,
    [EARLY_MORNING]: 0,
    [MORNING]: 0,
    [AFTERNOON]: 0,
    [EVENING]: 0,
    [NIGHT]: 0,
  };
  actions.forEach((action) => {
    const actionHourOfDay = getActionHourOfDay(action);
    if (actionHourOfDay >= 0 && actionHourOfDay < 4) {
      actionsByTimeOfDay[LATE_NIGHT] += 1;
    } else if (actionHourOfDay >= 4 && actionHourOfDay < 8) {
      actionsByTimeOfDay[EARLY_MORNING] += 1;
    } else if (actionHourOfDay >= 8 && actionHourOfDay < 12) {
      actionsByTimeOfDay[MORNING] += 1;
    } else if (actionHourOfDay >= 12 && actionHourOfDay < 16) {
      actionsByTimeOfDay[AFTERNOON] += 1;
    } else if (actionHourOfDay >= 16 && actionHourOfDay < 20) {
      actionsByTimeOfDay[EVENING] += 1;
    } else if (actionHourOfDay >= 20 && actionHourOfDay < 24) {
      actionsByTimeOfDay[NIGHT] += 1;
    } else {
      // eslint-disable-next-line no-console
      console.log(`actionHourOfDay ${actionHourOfDay} is undefined`);
    }
  });
  return actionsByTimeOfDay;
};

// Takes object with {key: value} pairs of {timeOfDay: #-of-actions}
// returns a date-sorted array in Recharts.js format
export const formatActionsByTimeOfDay = (actionsByTimeOfDayObject) => {
  const actionsByTimeOfDayArray = Object.entries(actionsByTimeOfDayObject);
  return actionsByTimeOfDayArray.map(([timeOfDay, count]) => {
    return {
      timeOfDay,
      count,
    };
  });
};

// Takes array of action objects and returns an object with {key: value} pairs of {verb: %-of-actions}
export const getActionsByVerb = (actions) => {
  const totalActionsCount = actions.length;
  const actionsByVerbCount = {};
  actions.forEach((action) => {
    if (!actionsByVerbCount[action.verb]) {
      // if verb is still not in the actionsByVerbCount object, add it and initialize it to 1
      actionsByVerbCount[action.verb] = 1;
      // else increment existing count
    } else {
      actionsByVerbCount[action.verb] += 1;
    }
  });

  // we want to return an object with key-value pairs of {verb: PERCENTAGE-of-total-actions}
  // therefore need to convert count of actions to a percentage
  // (1) convert actionsByVerbCount to an array of 2d arrays with [verb, count] via Object.entries
  // (2) map onto [verb, count / totalActionsCount]
  // (3) convert back into an object via Object.fromEntries
  const actionsByVerbCountArray = Object.entries(actionsByVerbCount);
  const actionsByVerbPercentageArray = actionsByVerbCountArray.map(
    ([verb, count]) => [verb, count / totalActionsCount],
  );
  const actionsByVerbPercentage = Object.fromEntries(
    actionsByVerbPercentageArray,
  );

  return actionsByVerbPercentage;
};

export const formatActionsByVerb = (actionsByVerbObject) => {
  const actionsByVerbArray = Object.entries(actionsByVerbObject);

  // capitalize verbs (entry[0][0]), convert 0.0x notation to x% and round to two decimal places (entry[0][1])
  const formattedActionsByVerbArray = actionsByVerbArray
    .map(([verb, ratio]) => [
      _.capitalize(verb),
      parseFloat((ratio * 100).toFixed(2)),
    ])
    .filter((entry) => entry[1] >= MIN_PERCENTAGE_TO_SHOW_VERB);

  // add ['other', x%] to cover all verbs that are filtered out of the array
  if (formattedActionsByVerbArray.length) {
    formattedActionsByVerbArray.push([
      OTHER_VERB,
      // ensure that it is a number with two decimal places
      parseFloat(
        (
          100 -
          formattedActionsByVerbArray.reduce(
            (acc, current) => acc + current[1],
            0,
          )
        ).toFixed(2),
      ),
    ]);
  }

  // convert to recharts required format
  return formattedActionsByVerbArray.map(([verb, percentage]) => ({
    verb,
    percentage,
  }));
};

// 'usersArray' has the form [ { ids: [1, 2], name: 'Augie March', type: 'light', value: 'Augie March'}, {...}, ... ]
// i.e. a user (identified by their name) can have multiple ids (due to different sign-in sesions)
// 'actions' is an array in the format retrieved from the API: [ { id: 1, user: 2, ... }, {...} ]
// therefore note: id is the id of the action, and user is the userId of the user performing the action
export const filterActionsByUser = (actions, usersArray) => {
  // if the dataset passed into the visualizer has hashed users, then user names are no longer available
  // instead, users key (and usersArray here) will be of the format... users: [{_id: hashedId}, {_id: hashedId2}, ...]
  // therefore slightly different filtering function
  if (usersArray.some((user) => !user.name)) {
    const userIdsArray = usersArray.map(({ _id }) => _id);
    return actions.filter((action) => userIdsArray.includes(action.user));
  }
  const userIdsArray = usersArray.map((user) => user.ids).flat();
  return actions.filter((action) => userIdsArray.includes(action.user));
};

// remove user 'Learning Analytics' from users list retrieved by API
// this is an auto-generated 'user' that we don't want to display in the application
export const removeLearningAnalyticsUser = (usersArray) => {
  return usersArray.filter((user) => user._id !== LEARNING_ANALYTICS_USER_ID);
};

// consolidate users with the same name into a single entry
// instead of users = [{id: 1, name: 'Augie March'}, {id: 2, name: 'augie march'}], users = [{ids: [1,2], name: 'augie march'}]
export const consolidateUsers = (usersArray) => {
  // if the dataset passed into the visualizer has hashed users, then user names are no longer available
  // instead, users key (and usersArray here) will be of the format... users: [{_id: hashedId}, {_id: hashedId2}, ...]
  // therefore return this array as is
  if (usersArray.some((user) => !user.name)) {
    return usersArray;
  }

  // remove trailing spaces from user names and turn them lower case
  const usersArrayWithTrimmedNames = usersArray.map((user) => {
    return { ...user, name: user.name.trim().toLowerCase() };
  });

  // group ids of matching user names under one object
  const consolidatedUsersArray = [];
  usersArrayWithTrimmedNames.forEach((user) => {
    const userIndex = consolidatedUsersArray.findIndex(
      (arrayUser) => arrayUser.name === user.name,
    );
    // if user doesn't exist in consolidatedUsersArray, push that user into the array
    if (userIndex === -1) {
      consolidatedUsersArray.push({
        ids: [user._id],
        name: user.name,
        type: user.type,
      });
    }
    // if user *does* exist in consolidatedUsersArray, push current user's id to that user's ids array
    else {
      consolidatedUsersArray[userIndex].ids.push(user._id);
    }
  });
  return consolidatedUsersArray;
};

// for presentation purposes, format user names, then sort them alphabetically
// proper names are recapitalized ('Augie March'), and only the first letter of emails is capitalized
export const formatConsolidatedUsers = (consolidatedUsersArray) => {
  // if the dataset passed into the visualizer has hashed users, then user names are no longer available
  // hence, consolidatedUsersArray will be of the format... consolidatedUsersArray: [{_id: hashedId}, {_id: hashedId2}, ...]
  // return this array as is (no point capitalizing, etc.)
  if (consolidatedUsersArray.some((user) => !user.name)) {
    return consolidatedUsersArray;
  }

  const usersArrayCapitalized = consolidatedUsersArray.map((user) => {
    // if user name includes @ symbol, only capitalize first letter
    if (user.name.indexOf('@') !== -1) {
      return {
        ...user,
        name: _.capitalize(user.name),
      };
    }
    // otherwise, reg exp below capitalizes first letter of each part of a user's space-delimited name
    return {
      ...user,
      name: user.name.replace(/\b(\w)/g, (char) => char.toUpperCase()),
    };
  });
  // return alphbatically sorted array of users
  return _.sortBy(usersArrayCapitalized, (user) => user.name);
};

// for react-select purposes, add a 'value' key to each element of the users array, holding the same value as the key 'name'
export const addValueKeyToUsers = (consolidatedUsersArray) => {
  return consolidatedUsersArray.map((user) => {
    // if !user.name, use the user._id. this occurs in cases where users have been hashed
    return { ...user, value: user.name || user._id };
  });
};

// used in UsersSelect dropdown: if a string is too long (which occurs when user Ids are hashed), show abbreviated version
export const formatDisplayedSelection = (valueKey) => {
  return valueKey.length < MAX_STRING_DISPLAYED_LENGTH
    ? valueKey
    : `${valueKey.slice(0, ABBREVIATED_STRING_LENGTH)}...`;
};
