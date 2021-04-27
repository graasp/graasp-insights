import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Container from '@material-ui/core/Container';
import Alert from '@material-ui/lab/Alert';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core';
import { useRouteMatch } from 'react-router';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import BackButton from '../common/BackButton';
import Loader from '../common/Loader';
import Main from '../common/Main';
import {
  getAlgorithms,
  getExecution,
  getDatasets,
  getResults,
  clearExecution,
} from '../../actions';
import ExecutionLog from './ExecutionLog';
import ExecutionInformationTable from './ExecutionInformationTable';
import { ALGORITHM_TYPES } from '../../shared/constants';

const useStyles = makeStyles((theme) => ({
  wrapper: {
    padding: theme.spacing(2, 4, 5),
  },
  infoAlert: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
}));

const ExecutionView = () => {
  const dispatch = useDispatch();
  const activity = useSelector(({ algorithms: a, dataset, result }) =>
    Boolean(
      a.get('activity').size +
        dataset.get('activity').size +
        result.get('activity').size,
    ),
  );
  const classes = useStyles();
  const { t } = useTranslation();
  const algorithmType =
    useSelector(({ executions }) =>
      executions.getIn(['current', 'algorithm', 'type']),
    ) || ALGORITHM_TYPES.ANONYMIZATION;

  const {
    params: { id },
  } = useRouteMatch();

  useEffect(() => {
    dispatch(getExecution(id));

    return () => {
      dispatch(clearExecution());
    };
  }, [dispatch, id]);

  useEffect(() => {
    dispatch(getAlgorithms());
    dispatch(getDatasets());
    dispatch(getResults());
  }, [dispatch]);

  if (activity) {
    return <Loader />;
  }

  if (!id) {
    return (
      <Main>
        <Container>
          <Alert severity="error" className={classes.infoAlert}>
            {t('An unexpected error happened while opening the execution.')}
          </Alert>
          <BackButton />
        </Container>
      </Main>
    );
  }

  return (
    <Main>
      <div className={classes.wrapper}>
        <Grid container justify="space-evenly" spacing={5}>
          <Grid item xs={12}>
            <BackButton />
            <Typography variant="h4" align="center">
              {t(
                algorithmType === ALGORITHM_TYPES.VALIDATION
                  ? 'Validation'
                  : 'Execution',
              )}
            </Typography>
          </Grid>
          <Grid item xs={5}>
            <ExecutionInformationTable id={id} />
          </Grid>
          <Grid item xs={7}>
            <ExecutionLog id={id} />
          </Grid>
        </Grid>
      </div>
    </Main>
  );
};

export default ExecutionView;
