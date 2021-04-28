import { makeStyles, Paper, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { getExecution } from '../../actions';
import { EXECUTION_VIEW_LOG_ID } from '../../config/selectors';
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

  useEffect(() => {
    dispatch(getExecution(id));
  }, [dispatch, id]);

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
