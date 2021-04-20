import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import AddIcon from '@material-ui/icons/Add';
import CancelIcon from '@material-ui/icons/Cancel';
import FailIcon from '@material-ui/icons/Close';
import DeleteIcon from '@material-ui/icons/Delete';
import SuccessIcon from '@material-ui/icons/Done';
import ErrorIcon from '@material-ui/icons/Error';
import WarningIcon from '@material-ui/icons/Warning';
import Alert from '@material-ui/lab/Alert';
import clsx from 'clsx';
import { List } from 'immutable';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import Loader from '../common/Loader';
import {
  cancelExecution,
  deleteValidation,
  getAlgorithms,
  getDatasets,
  getExecutions,
  getResults,
  getValidations,
} from '../../actions';
import {
  CIRCLE_PROGRESS_SIZE,
  DEFAULT_LOCALE_DATE,
} from '../../config/constants';
import {
  ADD_VALIDATION_PATH,
  buildDatasetPath,
  buildResultPath,
} from '../../config/paths';
import {
  ALGORITHM_NAME_CLASS,
  buildValidationRowClass,
  DATASET_NAME_CLASS,
  VALIDATION_ADD_BUTTON_ID,
  VALIDATION_DELETE_BUTTON_CLASS,
  VALIDATION_EXECUTION_RESULT_CLASS,
  VALIDATION_TABLE_ID,
} from '../../config/selectors';
import {
  ALGORITHM_TYPES,
  EXECUTION_STATUSES,
  VALIDATION_STATUSES,
} from '../../shared/constants';
import Main from '../common/Main';
import Table from '../common/Table';
import LoadDatasetButton from '../LoadDatasetButton';
import { FLAG_GETTING_VALIDATIONS } from '../../shared/types';

const styles = (theme) => ({
  link: {
    textTransform: 'none',
    textAlign: 'left',
  },
  addButton: {
    color: theme.palette.secondary.main,
    backgroundColor: theme.palette.primary.main,
    position: 'fixed',
    right: theme.spacing(2),
    bottom: theme.spacing(2),
    '&:hover, &.Mui-focusVisible': {
      backgroundColor: theme.palette.primary.main,
    },
  },
  infoAlert: {
    margin: theme.spacing(2),
  },
  statusInfoTooltip: {
    backgroundColor: 'white',
    color: 'black',
  },
  content: {
    // adds bottom space so that button doesn't stay above table when fully scrolled
    marginBottom: theme.spacing(10),
  },
});

const LightTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: theme.palette.common.white,
    color: 'rgba(0, 0, 0, 0.87)',
    boxShadow: theme.shadows[1],
    fontSize: 11,
  },
}))(Tooltip);

class Validation extends Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
    classes: PropTypes.shape({
      link: PropTypes.string.isRequired,
      addButton: PropTypes.string.isRequired,
      infoAlert: PropTypes.string.isRequired,
      statusInfoTooltip: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
    }).isRequired,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
    dispatchGetAlgorithms: PropTypes.func.isRequired,
    dispatchGetValidations: PropTypes.func.isRequired,
    dispatchDeleteValidation: PropTypes.func.isRequired,
    dispatchGetResults: PropTypes.func.isRequired,
    dispatchGetDatasets: PropTypes.func.isRequired,
    dispatchGetExecutions: PropTypes.func.isRequired,
    dispatchCancelExecution: PropTypes.func.isRequired,
    validations: PropTypes.instanceOf(List).isRequired,
    results: PropTypes.instanceOf(List).isRequired,
    datasets: PropTypes.instanceOf(List).isRequired,
    algorithms: PropTypes.instanceOf(List).isRequired,
    executions: PropTypes.instanceOf(List).isRequired,
    isLoading: PropTypes.bool.isRequired,
  };

  componentDidMount() {
    const {
      dispatchGetValidations,
      dispatchGetDatasets,
      dispatchGetResults,
      dispatchGetAlgorithms,
      dispatchGetExecutions,
    } = this.props;
    dispatchGetValidations();
    dispatchGetDatasets();
    dispatchGetResults();
    dispatchGetAlgorithms();
    dispatchGetExecutions();
  }

  handleAdd = () => {
    const {
      history: { push },
    } = this.props;
    push(ADD_VALIDATION_PATH);
  };

  handleDelete = ({ id }) => {
    const { dispatchDeleteValidation, t } = this.props;
    dispatchDeleteValidation({ id, name: t('this validation') });
  };

  handleResultView = (resultId) => {
    const {
      history: { push },
    } = this.props;
    push(buildResultPath(resultId));
  };

  handleSourceView = (sourceId) => {
    const {
      history: { push },
    } = this.props;
    push(buildDatasetPath(sourceId));
  };

  handleCancel = (id) => {
    const { dispatchCancelExecution } = this.props;
    dispatchCancelExecution({ id });
  };

  renderAddButon() {
    const { classes } = this.props;
    return (
      <IconButton
        id={VALIDATION_ADD_BUTTON_ID}
        variant="contained"
        className={classes.addButton}
        onClick={this.handleAdd}
      >
        <AddIcon />
      </IconButton>
    );
  }

  renderTable() {
    const {
      t,
      classes,
      validations,
      datasets,
      results,
      algorithms,
      executions,
    } = this.props;

    const columns = [
      {
        columnName: 'Name',
        sortBy: 'name',
        field: 'name',
        alignColumn: 'left',
        alignField: 'left',
      },
      {
        columnName: 'Validation result',
        field: 'verifications',
        alignColumn: 'left',
        alignField: 'center',
        fieldColSpan: 2,
      },
      {
        columnName: 'Status',
        alignColumn: 'center',
      },
      {
        columnName: 'Verified',
        sortBy: 'verifiedAt',
        field: 'verifiedAt',
        alignColumn: 'right',
        alignField: 'right',
      },
      {
        columnName: 'Quick Actions',
        field: 'quickActions',
        alignColumn: 'right',
        alignField: 'right',
      },
    ];

    const rows = validations.map((validation) => {
      const {
        id: validationId,
        verifiedAt,
        source: { id: sourceId },
        executions: validationExecutions,
      } = validation;

      const verifiedAtString = verifiedAt
        ? new Date(verifiedAt).toLocaleString(DEFAULT_LOCALE_DATE)
        : t('Unknown');

      const sName =
        [...(datasets || []), ...(results || [])].find(
          ({ id: thisSourceId }) => thisSourceId === sourceId,
        )?.name || t('Unknown');

      const sourceProps = sourceId
        ? {
            onClick: () => this.handleSourceView(sourceId),
          }
        : {
            disabled: true,
          };
      const sourceNameButton = (
        <Button
          className={clsx(DATASET_NAME_CLASS, classes.link)}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...sourceProps}
        >
          {sName}
        </Button>
      );

      const verificationsGrid = (
        <Grid container direction="column">
          {validationExecutions.map((executionId) => {
            const execution = executions.find(({ id }) => id === executionId);
            if (!execution) {
              return null;
            }

            const {
              status,
              result: { outcome, info },
            } = execution;

            const algorithmName =
              algorithms.find(({ id }) => id === execution?.algorithm?.id)
                ?.name || t('Unknown');

            let statusIcon;
            switch (status) {
              case EXECUTION_STATUSES.SUCCESS:
                statusIcon =
                  // eslint-disable-next-line no-nested-ternary
                  outcome === VALIDATION_STATUSES.SUCCESS ? (
                    <LightTooltip title={<pre>{info}</pre>}>
                      <SuccessIcon
                        className={outcome}
                        style={{ color: 'green' }}
                      />
                    </LightTooltip>
                  ) : outcome === VALIDATION_STATUSES.WARNING ? (
                    <LightTooltip title={<pre>{info}</pre>}>
                      <WarningIcon
                        className={outcome}
                        style={{ color: 'orange' }}
                      />
                    </LightTooltip>
                  ) : (
                    <LightTooltip title={<pre>{info}</pre>}>
                      <FailIcon className={outcome} style={{ color: 'red' }} />
                    </LightTooltip>
                  );
                break;
              case EXECUTION_STATUSES.ERROR:
                statusIcon = (
                  <LightTooltip title={t('An error occurred during execution')}>
                    <ErrorIcon className={status} style={{ color: 'red' }} />
                  </LightTooltip>
                );
                break;
              case EXECUTION_STATUSES.RUNNING:
                statusIcon = (
                  <LightTooltip title={t('Execution running...')}>
                    <CircularProgress
                      className={status}
                      size={CIRCLE_PROGRESS_SIZE}
                    />
                  </LightTooltip>
                );
                break;
              default:
                break;
            }

            return (
              <Grid
                container
                item
                alignItems="center"
                spacing={2}
                justify="space-between"
                key={executionId}
                className={VALIDATION_EXECUTION_RESULT_CLASS}
              >
                <Grid
                  item
                  xs={9}
                  className={ALGORITHM_NAME_CLASS}
                  style={{ textAlign: 'start' }}
                >
                  {algorithmName}
                </Grid>
                <Grid container item xs={3} alignItems="center">
                  <Grid item xs={6}>
                    {statusIcon}
                  </Grid>
                  <Grid item xs={6}>
                    {status === EXECUTION_STATUSES.RUNNING && (
                      <Tooltip title={t('Cancel execution')}>
                        <IconButton
                          aria-label="cancel"
                          onClick={() => {
                            this.handleCancel(executionId);
                          }}
                        >
                          <CancelIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Grid>
                </Grid>
              </Grid>
            );
          })}
        </Grid>
      );

      return {
        className: buildValidationRowClass(
          sName,
          executions.map(({ algorithmName }) => algorithmName),
        ),
        key: validationId,
        name: sourceNameButton,
        verifiedAt: verifiedAtString,
        verifications: verificationsGrid,
        quickActions: (
          <Tooltip title={t('Remove validation')}>
            <IconButton
              className={VALIDATION_DELETE_BUTTON_CLASS}
              aria-label="delete"
              onClick={() => this.handleDelete({ id: validationId })}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        ),
      };
    });

    return <Table id={VALIDATION_TABLE_ID} columns={columns} rows={rows} />;
  }

  render() {
    const {
      t,
      classes,
      validations,
      datasets,
      results,
      algorithms,
      isLoading,
    } = this.props;

    if (isLoading) {
      return (
        <Main>
          <Loader />
        </Main>
      );
    }

    if (datasets.isEmpty() && results.isEmpty()) {
      return (
        <Main>
          <Alert severity="info" className={classes.infoAlert}>
            {t('Load a dataset first')}
          </Alert>
        </Main>
      );
    }

    if (algorithms.isEmpty()) {
      return (
        <Main>
          <Alert
            severity="info"
            className={classes.infoAlert}
            key="no-algorithm"
          >
            {t('No validation algorithms available')}
          </Alert>
        </Main>
      );
    }

    if (!validations.size) {
      return (
        <Main>
          <Alert severity="info" className={classes.infoAlert}>
            {t('Validate dataset by clicking on the icon below.')}
          </Alert>
          {this.renderAddButon()}
        </Main>
      );
    }

    return (
      <Main>
        <Container className={classes.content}>
          <h1>{t('Validation')}</h1>
          {this.renderTable()}
          <LoadDatasetButton />
        </Container>
        {this.renderAddButon()}
      </Main>
    );
  }
}

const mapStateToProps = ({
  validation,
  dataset,
  result,
  algorithms,
  executions,
}) => ({
  validations: validation.get('validations'),
  datasets: dataset.getIn(['datasets']),
  results: result.getIn(['results']),
  algorithms: algorithms
    .get('algorithms')
    .filter(({ type }) => type === ALGORITHM_TYPES.VALIDATION),
  executions: executions.getIn(['executions']),
  isLoading:
    Boolean(validation.getIn(['activity', FLAG_GETTING_VALIDATIONS]).size) &&
    Boolean(dataset.getIn(['activity']).size) &&
    Boolean(algorithms.getIn(['activity']).size) &&
    Boolean(executions.get('activity').size),
});

const mapDispatchToProps = {
  dispatchGetValidations: getValidations,
  dispatchGetDatasets: getDatasets,
  dispatchGetResults: getResults,
  dispatchDeleteValidation: deleteValidation,
  dispatchGetAlgorithms: getAlgorithms,
  dispatchGetExecutions: getExecutions,
  dispatchCancelExecution: cancelExecution,
};

const ConnectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Validation);

const StyledComponent = withStyles(styles)(ConnectedComponent);

const TranslatedComponent = withTranslation()(StyledComponent);

export default withRouter(TranslatedComponent);
