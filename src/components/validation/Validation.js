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
import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import {
  cancelValidationExecution,
  deleteValidation,
  getAlgorithms,
  getDatasets,
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
  VALIDATION_TABLE_ID,
  buildValidationRowClass,
  DATASET_NAME_CLASS,
  ALGORITHM_NAME_CLASS,
  VALIDATION_EXECUTION_RESULT_CLASS,
  VALIDATION_DELETE_BUTTON_CLASS,
  VALIDATION_ADD_BUTTON_ID,
} from '../../config/selectors';
import {
  EXECUTION_STATUSES,
  VALIDATION_STATUSES,
} from '../../shared/constants';
import Main from '../common/Main';
import Table from '../common/Table';
import LoadDatasetButton from '../LoadDatasetButton';

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
    dispatchCancelValidationExecution: PropTypes.func.isRequired,
    validations: PropTypes.instanceOf(List).isRequired,
    results: PropTypes.instanceOf(List).isRequired,
    datasets: PropTypes.instanceOf(List).isRequired,
  };

  componentDidMount() {
    const {
      dispatchGetValidations,
      dispatchGetDatasets,
      dispatchGetResults,
      dispatchGetAlgorithms,
    } = this.props;
    dispatchGetValidations();
    dispatchGetDatasets();
    dispatchGetResults();
    dispatchGetAlgorithms();
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

  handleCancel = (validationId, executionId) => {
    const { dispatchCancelValidationExecution } = this.props;
    dispatchCancelValidationExecution({ validationId, executionId });
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
    const { t, classes, validations, datasets, results } = this.props;

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
        id,
        verifiedAt,
        source: { id: sourceId },
        executions,
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
          {executions.map(
            ({
              id: executionId,
              algorithmName,
              status,
              result: { outcome, info },
            }) => {
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
                        <FailIcon
                          className={outcome}
                          style={{ color: 'red' }}
                        />
                      </LightTooltip>
                    );
                  break;
                case EXECUTION_STATUSES.ERROR:
                  statusIcon = (
                    <LightTooltip
                      title={t('An error occurred during execution')}
                    >
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
                  key={executionId}
                  className={VALIDATION_EXECUTION_RESULT_CLASS}
                >
                  <Grid item>{statusIcon}</Grid>
                  <Grid item className={ALGORITHM_NAME_CLASS}>
                    {algorithmName}
                  </Grid>
                  {status === EXECUTION_STATUSES.RUNNING && (
                    <Grid item>
                      <Tooltip title={t('Cancel execution')}>
                        <IconButton
                          aria-label="cancel"
                          onClick={() => this.handleCancel(id, executionId)}
                        >
                          <CancelIcon />
                        </IconButton>
                      </Tooltip>
                    </Grid>
                  )}
                </Grid>
              );
            },
          )}
        </Grid>
      );

      return {
        className: buildValidationRowClass(
          sName,
          executions.map(({ algorithmName }) => algorithmName),
        ),
        key: id,
        name: sourceNameButton,
        verifiedAt: verifiedAtString,
        verifications: verificationsGrid,
        quickActions: (
          <Tooltip title={t('Remove validation')}>
            <IconButton
              className={VALIDATION_DELETE_BUTTON_CLASS}
              aria-label="delete"
              onClick={() => this.handleDelete({ id })}
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
    const { t, classes, validations } = this.props;

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

const mapStateToProps = ({ validation, dataset, result }) => ({
  validations: validation.get('validations'),
  datasets: dataset.getIn(['datasets']),
  results: result.getIn(['results']),
});

const mapDispatchToProps = {
  dispatchGetValidations: getValidations,
  dispatchGetDatasets: getDatasets,
  dispatchGetResults: getResults,
  dispatchDeleteValidation: deleteValidation,
  dispatchGetAlgorithms: getAlgorithms,
  dispatchCancelValidationExecution: cancelValidationExecution,
};

const ConnectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Validation);

const StyledComponent = withStyles(styles)(ConnectedComponent);

const TranslatedComponent = withTranslation()(StyledComponent);

export default withRouter(TranslatedComponent);
