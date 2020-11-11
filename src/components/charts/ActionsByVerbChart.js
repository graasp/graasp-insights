import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { ResponsiveContainer, PieChart, Pie, Tooltip, Cell } from 'recharts';
import EmptyChart from './EmptyChart';
import {
  getActionsByVerb,
  filterActionsByUser,
  formatActionsByVerb,
} from '../../utils/charts';
import { COLORS, CONTAINER_HEIGHT } from '../../config/constants';

const useStyles = makeStyles((theme) => ({
  typography: { textAlign: 'center', marginTop: theme.spacing(4) },
}));

const ActionsByVerbChart = ({
  actions,
  allUsersConsolidated,
  usersToFilter,
  setError,
}) => {
  const { t } = useTranslation();
  const classes = useStyles();

  try {
    // actionsByVerb is the object passed, after formatting, to the PieChart component below
    // (1) if you remove all names in the react-select dropdown, usersToFilter becomes null; in this case, show all actions
    // (2) if no users are selected (i.e. usersToFilter.length === 0), show all actions
    // (3) if all users are selected (i.e. usersToFilter.length === allUsers.length), also show all actions
    // #3 above is necessary: some actions are made by users NOT in the users list (e.g. user account deleted)
    // e.g. we retrieve 100 total actions and 10 users, but these 10 users have only made 90 actions
    // therefore, to avoid confusion: when all users are selected, show all actions
    let actionsByVerb;
    if (
      usersToFilter === null ||
      usersToFilter.length === 0 ||
      usersToFilter.length === allUsersConsolidated.length
    ) {
      actionsByVerb = getActionsByVerb(actions);
    } else {
      actionsByVerb = getActionsByVerb(
        filterActionsByUser(actions, usersToFilter),
      );
    }
    const formattedActionsByVerb = formatActionsByVerb(actionsByVerb);

    // if selected user(s) have no actions, render component with message that there are no actions
    if (formattedActionsByVerb.length === 0) {
      return (
        <EmptyChart
          usersToFilter={usersToFilter}
          chartTitle={t('Actions by Verb')}
        />
      );
    }

    return (
      <>
        <Typography variant="subtitle1" className={classes.typography}>
          {t('Actions by Verb')}
        </Typography>
        <ResponsiveContainer width="95%" height={CONTAINER_HEIGHT}>
          <PieChart fontSize={14}>
            <Pie
              data={formattedActionsByVerb}
              dataKey="percentage"
              nameKey="verb"
              unit="%"
              label={({ value }) => `${value}%`}
            >
              {formattedActionsByVerb.map((entry, index) => (
                <Cell key={entry.verb} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `${value}%`} />
          </PieChart>
        </ResponsiveContainer>
      </>
    );
  } catch (err) {
    setError(err);
    return null;
  }
};

ActionsByVerbChart.propTypes = {
  actions: PropTypes.arrayOf(PropTypes.object).isRequired,
  allUsersConsolidated: PropTypes.arrayOf(PropTypes.object).isRequired,
  usersToFilter: PropTypes.arrayOf(PropTypes.object).isRequired,
  setError: PropTypes.func.isRequired,
};

export default ActionsByVerbChart;
