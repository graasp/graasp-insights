import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import Alert from '@material-ui/lab/Alert';
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

const useStyles = makeStyles((theme) => ({
  infoAlert: {
    margin: theme.spacing(2),
  },
}));

const ChartsLayout = ({ retrievedDatasetContent }) => {
  const { t } = useTranslation();
  const classes = useStyles();

  const [datasetContent, setDatasetContent] = useState();
  const [usersToFilter, setUsersToFilter] = useState([]);
  const [error, setError] = useState();

  useEffect(() => {
    setDatasetContent(retrievedDatasetContent);
    setError();
  }, [retrievedDatasetContent]);

  if (!datasetContent) {
    return null;
  }

  if (error) {
    return (
      <Alert severity="error" className={classes.infoAlert}>
        {t('There was an error visualizing this dataset.')}
      </Alert>
    );
  }

  try {
    const dataInJson = JSON.parse(datasetContent);
    const { data } = dataInJson;
    const { actions, users } = data;

    if (!actions.length) {
      return (
        <Alert severity="warning" className={classes.infoAlert}>
          {t('This dataset does not contain any actions.')}
        </Alert>
      );
    }

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
              setError={setError}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <ActionsMap
              actions={actions}
              allUsersConsolidated={allUsersConsolidated}
              usersToFilter={usersToFilter}
              setError={setError}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <ActionsByTimeOfDayChart
              actions={actions}
              allUsersConsolidated={allUsersConsolidated}
              usersToFilter={usersToFilter}
              setError={setError}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <ActionsByVerbChart
              actions={actions}
              allUsersConsolidated={allUsersConsolidated}
              usersToFilter={usersToFilter}
              setError={setError}
            />
          </Grid>
        </Grid>
      </div>
    );
  } catch (err) {
    setError(err);
    return null;
  }
};

ChartsLayout.propTypes = {
  retrievedDatasetContent: PropTypes.string.isRequired,
};

export default ChartsLayout;
