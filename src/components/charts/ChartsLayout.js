import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import UsersSelect from './UsersSelect';
import ActionsByDayChart from './ActionsByDayChart';
import ActionsMap from './ActionsMap';
import ActionsByTimeOfDayChart from './ActionsByTimeOfDayChart';
import ActionsByVerbChart from './ActionsByVerbChart';
import {
  removeLearningAnalyticsUser,
  consolidateUsers,
  formatConsolidatedUsers,
  addValueKeyToUsers,
} from '../../utils/charts';

const ChartsLayout = ({ retrievedDatasetContent }) => {
  const [usersToFilter, setUsersToFilter] = useState([]);
  if (!retrievedDatasetContent) {
    return null;
  }

  const dataInJson = JSON.parse(retrievedDatasetContent);
  const { data } = dataInJson;
  const { actions, users } = data;

  const allUsersConsolidated = addValueKeyToUsers(
    formatConsolidatedUsers(
      consolidateUsers(removeLearningAnalyticsUser(users)),
    ),
  );

  return (
    <div>
      <UsersSelect
        allUsersConsolidated={allUsersConsolidated}
        setUsersToFilter={setUsersToFilter}
      />
      <Grid container>
        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
          <ActionsByDayChart
            actions={actions}
            allUsersConsolidated={allUsersConsolidated}
            usersToFilter={usersToFilter}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
          <ActionsMap
            actions={actions}
            allUsersConsolidated={allUsersConsolidated}
            usersToFilter={usersToFilter}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
          <ActionsByTimeOfDayChart
            actions={actions}
            allUsersConsolidated={allUsersConsolidated}
            usersToFilter={usersToFilter}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
          <ActionsByVerbChart
            actions={actions}
            allUsersConsolidated={allUsersConsolidated}
            usersToFilter={usersToFilter}
          />
        </Grid>
      </Grid>
    </div>
  );
};

ChartsLayout.propTypes = {
  retrievedDatasetContent: PropTypes.string.isRequired,
};

export default ChartsLayout;
