import { makeStyles, Paper, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { getExecution } from '../../actions';
import { GET_EXECUTION_INTERVAL_TIME } from '../../config/constants';
import { EXECUTION_VIEW_LOG_ID } from '../../config/selectors';
import { EXECUTION_STATUSES } from '../../shared/constants';
import ExecutionStatusIcon from './ExecutionStatusIcon';

const useStyles = makeStyles((theme) => ({
  statusIcon: {
    marginLeft: theme.spacing(2),
  },
  content: {
    padding: theme.spacing(1),
  },
  log: {
    wordBreak: 'break-word',
    whiteSpace: 'pre-wrap',
  },
}));

const ExecutionLog = ({ id }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const execution = useSelector(({ executions }) => executions.get('current'));

  // fetch execution to update log every set interval
  useEffect(() => {
    let interval = null;
    if (execution.get('status') === EXECUTION_STATUSES.RUNNING) {
      interval = setInterval(() => {
        dispatch(getExecution(id));
      }, GET_EXECUTION_INTERVAL_TIME);
    } else {
      clearInterval(interval);
    }
    return () => {
      clearInterval(interval);
    };
  }, [execution, id, dispatch]);

  return (
    <>
      <Typography variant="h5">
        {t('Log')}
        <ExecutionStatusIcon
          className={classes.statusIcon}
          status={execution.get('status')}
        />
      </Typography>
      <Paper className={classes.content}>
        <pre id={EXECUTION_VIEW_LOG_ID} className={classes.log}>
          {execution.get('log')}
        </pre>
      </Paper>
    </>
  );
};

ExecutionLog.propTypes = {
  id: PropTypes.string.isRequired,
};

export default ExecutionLog;
