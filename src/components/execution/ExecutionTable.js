import React, { Component } from 'react';
import { connect } from 'react-redux';
import { List } from 'immutable';
import { withRouter } from 'react-router';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import SuccessIcon from '@material-ui/icons/Done';
import ErrorIcon from '@material-ui/icons/Clear';
import CancelIcon from '@material-ui/icons/Cancel';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import Table from '../common/Table';
import {
  getDatasets,
  getAlgorithms,
  createExecution,
  getExecutions,
  deleteExecution,
  getResults,
  cancelExecution,
} from '../../actions';
import Loader from '../common/Loader';
import {
  CIRCLE_PROGRESS_SIZE,
  DEFAULT_LOCALE_DATE,
} from '../../config/constants';
import {
  buildDatasetPath,
  buildEditAlgorithmPath,
  buildResultPath,
} from '../../config/paths';
import {
  buildExecutionRowAlgorithmButtonId,
  buildExecutionRowSourceButtonId,
  EXECUTIONS_EXECUTION_CANCEL_BUTTON_CLASS,
  EXECUTIONS_EXECUTION_DELETE_BUTTON_CLASS,
  EXECUTIONS_TABLE_ID,
} from '../../config/selectors';
import { EXECUTION_STATUSES } from '../../shared/constants';

const styles = () => ({
  link: {
    textTransform: 'none',
    textAlign: 'left',
  },
});

class ExecutionTable extends Component {
  static propTypes = {
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
    datasets: PropTypes.instanceOf(List),
    results: PropTypes.instanceOf(List),
    algorithms: PropTypes.instanceOf(List),
    executions: PropTypes.instanceOf(List),
    t: PropTypes.func.isRequired,
    dispatchGetDatasets: PropTypes.func.isRequired,
    dispatchGetAlgorithms: PropTypes.func.isRequired,
    dispatchGetExecutions: PropTypes.func.isRequired,
    dispatchDeleteExecution: PropTypes.func.isRequired,
    dispatchGetResults: PropTypes.func.isRequired,
    dispatchCancelExecution: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
    classes: PropTypes.shape({
      container: PropTypes.string.isRequired,
      pythonLogo: PropTypes.string.isRequired,
      button: PropTypes.string.isRequired,
      link: PropTypes.string.isRequired,
    }).isRequired,
    pythonVersion: PropTypes.shape({
      valid: PropTypes.bool,
      version: PropTypes.string,
    }).isRequired,
  };

  static defaultProps = {
    datasets: null,
    algorithms: null,
    executions: null,
    results: null,
  };

  componentDidMount() {
    const {
      dispatchGetDatasets,
      dispatchGetAlgorithms,
      dispatchGetExecutions,
      dispatchGetResults,
    } = this.props;
    dispatchGetDatasets();
    dispatchGetAlgorithms();
    dispatchGetResults();
    dispatchGetExecutions();
  }

  handleDelete = (execution) => {
    const { dispatchDeleteExecution } = this.props;
    dispatchDeleteExecution({ id: execution.id });
  };

  handleCancel = (execution) => {
    const { dispatchCancelExecution } = this.props;
    dispatchCancelExecution({ id: execution.id });
  };

  handleSourceView = (sourceId) => {
    const {
      history: { push },
    } = this.props;
    push(buildDatasetPath(sourceId));
  };

  handleAlgorithmView = (algorithmId) => {
    const {
      history: { push },
    } = this.props;
    push(buildEditAlgorithmPath(algorithmId));
  };

  handleResultView = (resultId) => {
    const {
      history: { push },
    } = this.props;
    push(buildResultPath(resultId));
  };

  render() {
    const {
      t,
      executions,
      datasets,
      algorithms,
      isLoading,
      classes,
      results,
    } = this.props;

    if (isLoading) {
      return <Loader />;
    }

    if (executions.isEmpty()) {
      return null;
    }

    const columns = [
      {
        columnName: t('Dataset'),
        sortBy: 'sourceName',
        field: 'sourceName',
        alignColumn: 'left',
        alignField: 'left',
      },
      {
        columnName: t('Algorithm'),
        sortBy: 'algorithmName',
        field: 'algorithmName',
        alignColumn: 'left',
        alignField: 'left',
      },
      {
        columnName: t('Result'),
        sortBy: 'resultId',
        field: 'resultId',
        alignColumn: 'left',
        alignField: 'left',
      },
      {
        columnName: t('Executed'),
        sortBy: 'executedAt',
        field: 'executedAt',
        alignColumn: 'right',
        alignField: 'right',
      },
      {
        columnName: t('Status'),
        sortBy: 'status',
        field: 'status',
        alignColumn: 'right',
        alignField: 'right',
      },
      {
        columnName: t('Quick actions'),
        field: 'quickActions',
        alignColumn: 'right',
        alignField: 'right',
      },
    ];

    const rows = executions.reverse().map((execution) => {
      const {
        id,
        executedAt,
        algorithmId,
        sourceId,
        resultId,
        status,
      } = execution;

      const executedAtString = executedAt
        ? new Date(executedAt).toLocaleString(DEFAULT_LOCALE_DATE)
        : t('Unknown');
      const sourceName = [...datasets, ...results].find(
        ({ id: thisSourceId }) => thisSourceId === sourceId,
      )?.name;
      const resultName = results.find(
        ({ id: thisResultId }) => thisResultId === resultId,
      )?.name;

      const sourceNameButton = sourceName ? (
        <Button
          className={classes.link}
          id={buildExecutionRowSourceButtonId(sourceId)}
          onClick={() => this.handleSourceView(sourceId)}
        >
          {sourceName}
        </Button>
      ) : (
        t('Unknown')
      );

      const algorithmName =
        algorithms.find(
          ({ id: thisAlgorithmId }) => thisAlgorithmId === algorithmId,
        )?.name || t('Unknown');

      const algorithmButton = sourceName ? (
        <Button
          className={classes.link}
          onClick={() => this.handleAlgorithmView(algorithmId)}
          id={buildExecutionRowAlgorithmButtonId(algorithmId)}
        >
          {algorithmName}
        </Button>
      ) : (
        t('Unknown')
      );

      const resultButton = resultName ? (
        <Button
          className={classes.link}
          onClick={() => this.handleResultView(resultId)}
        >
          {resultName}
        </Button>
      ) : (
        t('Unknown')
      );

      let statusIcon = null;
      switch (status) {
        case EXECUTION_STATUSES.SUCCESS:
          statusIcon = (
            <Tooltip title={t('Execution successful')}>
              <SuccessIcon className={status} style={{ color: 'green' }} />
            </Tooltip>
          );
          break;
        case EXECUTION_STATUSES.ERROR:
          statusIcon = (
            <Tooltip title={t('An error occurred during execution')}>
              <ErrorIcon className={status} style={{ color: 'red' }} />
            </Tooltip>
          );
          break;
        case EXECUTION_STATUSES.RUNNING:
          statusIcon = (
            <Tooltip title={t('Execution running...')}>
              <CircularProgress
                className={status}
                size={CIRCLE_PROGRESS_SIZE}
              />
            </Tooltip>
          );
          break;
        default:
          break;
      }

      const quickActions =
        status === EXECUTION_STATUSES.RUNNING ? (
          <Tooltip title={t('Cancel execution')} key="cancel">
            <IconButton
              className={EXECUTIONS_EXECUTION_CANCEL_BUTTON_CLASS}
              aria-label="cancel"
              onClick={() => this.handleCancel(execution)}
            >
              <CancelIcon />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title={t('Remove execution')} key="delete">
            <IconButton
              className={EXECUTIONS_EXECUTION_DELETE_BUTTON_CLASS}
              aria-label="delete"
              onClick={() => this.handleDelete(execution)}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        );

      return {
        key: id,
        sourceName: sourceNameButton,
        algorithmName: algorithmButton,
        resultId: resultButton,
        status: statusIcon,
        executedAt: executedAtString,
        quickActions,
      };
    });

    return <Table id={EXECUTIONS_TABLE_ID} columns={columns} rows={rows} />;
  }
}

const mapStateToProps = ({
  dataset,
  algorithms,
  settings,
  executions,
  result,
}) => ({
  datasets: dataset.get('datasets'),
  algorithms: algorithms.get('algorithms'),
  isLoading:
    Boolean(dataset.getIn(['activity']).size) &&
    Boolean(algorithms.getIn(['activity']).size) &&
    Boolean(executions.get('activity').size),
  pythonVersion: settings.get('pythonVersion'),
  executions: executions.getIn(['executions']),
  results: result.getIn(['results']),
});

const mapDispatchToProps = {
  dispatchGetDatasets: getDatasets,
  dispatchGetAlgorithms: getAlgorithms,
  dispatchGetResults: getResults,
  dispatchCreateExecution: createExecution,
  dispatchGetExecutions: getExecutions,
  dispatchDeleteExecution: deleteExecution,
  dispatchCancelExecution: cancelExecution,
};

const ConnectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ExecutionTable);

const StyledComponent = withStyles(styles)(ConnectedComponent);

const TranslatedComponent = withTranslation()(StyledComponent);

export default withRouter(TranslatedComponent);
