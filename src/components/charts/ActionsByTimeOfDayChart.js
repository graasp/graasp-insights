import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import {
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  ResponsiveContainer,
} from 'recharts';
import EmptyChart from './EmptyChart';
import CustomTooltip from './custom/CustomTooltip';
import {
  getActionsByTimeOfDay,
  formatActionsByTimeOfDay,
  filterActionsByUser,
  findYAxisMax,
} from '../../utils/charts';
import { TICK_FONT_SIZE, CONTAINER_HEIGHT } from '../../config/constants';

const useStyles = makeStyles((theme) => ({
  typography: { textAlign: 'center', marginTop: theme.spacing(4) },
  chart: { marginTop: 30, marginRight: 20, marginBottom: 20, marginLeft: 20 },
}));

const ActionsByTimeOfDayChart = ({
  actions,
  allUsersConsolidated,
  usersToFilter,
  setError,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const classes = useStyles();

  try {
    // actionsByTimeOfDay is the object passed, after formatting, to the BarChart component below
    // (1) if you remove all names in the react-select dropdown, usersToFilter becomes null; in this case, show all actions
    // (2) if no users are selected (i.e. usersToFilter.length === 0), show all actions
    // (3) if all users are selected (i.e. usersToFilter.length === allUsers.length), also show all actions
    // #3 above is necessary: some actions are made by users NOT in the users list (e.g. user account deleted)
    // e.g. we retrieve 100 total actions and 10 users, but these 10 users have only made 90 actions
    // therefore, to avoid confusion: when all users are selected, show all actions
    let actionsByTimeOfDay;
    if (
      usersToFilter === null ||
      usersToFilter.length === 0 ||
      usersToFilter.length === allUsersConsolidated.length
    ) {
      actionsByTimeOfDay = getActionsByTimeOfDay(actions);
    } else {
      actionsByTimeOfDay = getActionsByTimeOfDay(
        filterActionsByUser(actions, usersToFilter),
      );
    }

    const yAxisMax = findYAxisMax(actionsByTimeOfDay);
    const formattedActionsByTimeOfDay = formatActionsByTimeOfDay(
      actionsByTimeOfDay,
    );

    // if selected user(s) have no actions, render component with message that there are no actions
    if (
      formattedActionsByTimeOfDay.every((timePeriod) => timePeriod.count === 0)
    ) {
      return (
        <EmptyChart
          usersToFilter={usersToFilter}
          chartTitle={t('Actions by Time of Day')}
        />
      );
    }

    return (
      <>
        <Typography variant="subtitle1" className={classes.typography}>
          {t('Actions by Time of Day')}
        </Typography>
        <ResponsiveContainer width="95%" height={CONTAINER_HEIGHT}>
          <BarChart
            data={formattedActionsByTimeOfDay}
            className={classes.chart}
          >
            <CartesianGrid strokeDasharray="2" />
            <XAxis dataKey="timeOfDay" tick={{ fontSize: TICK_FONT_SIZE }} />
            <YAxis tick={{ fontSize: TICK_FONT_SIZE }} domain={[0, yAxisMax]} />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="count"
              name="Count"
              fill={theme.palette.tertiary.main}
            />
          </BarChart>
        </ResponsiveContainer>
      </>
    );
  } catch (err) {
    setError(err);
    return null;
  }
};

ActionsByTimeOfDayChart.propTypes = {
  actions: PropTypes.arrayOf(PropTypes.object).isRequired,
  allUsersConsolidated: PropTypes.arrayOf(PropTypes.object).isRequired,
  usersToFilter: PropTypes.arrayOf(PropTypes.object).isRequired,
  setError: PropTypes.func.isRequired,
};

export default ActionsByTimeOfDayChart;
