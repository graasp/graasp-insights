import React, { Component } from 'react';
import { connect } from 'react-redux';
import { List } from 'immutable';
import { withRouter } from 'react-router';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import Tooltip from '@material-ui/core/Tooltip';
import CancelIcon from '@material-ui/icons/Cancel';
import VisibilityIcon from '@material-ui/icons/Visibility';
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
import { DEFAULT_LOCALE_DATE } from '../../config/constants';
import { buildExecutionPath } from '../../config/paths';
import {
  buildExecutionAlgorithmButtonId,
  buildExecutionResultButtonId,
  buildExecutionSourceButtonId,
  buildExecutionViewButtonId,
  EXECUTIONS_EXECUTION_CANCEL_BUTTON_CLASS,
  EXECUTIONS_EXECUTION_DELETE_BUTTON_CLASS,
  EXECUTIONS_TABLE_ID,
} from '../../config/selectors';
import { ALGORITHM_TYPES, EXECUTION_STATUSES } from '../../shared/constants';
import ExecutionStatusIcon from './ExecutionStatusIcon';
import ResultViewButton from './ResultViewButton';
import AlgorithmViewButton from './AlgorithmViewButton';
import DatasetViewButton from './DatasetViewButton';

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
      link: PropTypes.string.isRequired,
    }).isRequired,
  };

  static defaultProps = {
    datasets: null,
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

  componentDidUpdate({ executions: prevExecutions }) {
    const { executions, dispatchGetResults } = this.props;
    if (!prevExecutions.equals(executions)) {
      dispatchGetResults();
    }
  }

  handleDelete = (execution) => {
    const { dispatchDeleteExecution, t } = this.props;
    dispatchDeleteExecution({ id: execution.id, name: t('this execution') });
  };

  handleCancel = (execution) => {
    const { dispatchCancelExecution } = this.props;
    dispatchCancelExecution({ id: execution.id });
  };

  handleView = (executionId) => {
    const {
      history: { push },
    } = this.props;
    push(buildExecutionPath(executionId));
  };

  render() {
    const { t, executions, isLoading } = this.props;

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
        columnName: t('Quick Actions'),
        field: 'quickActions',
        alignColumn: 'right',
        alignField: 'right',
      },
    ];

    const rows = executions.reverse().map((execution) => {
      const { id, executedAt, algorithm, source, result, status } = execution;

      const executedAtString = executedAt
        ? new Date(executedAt).toLocaleString(DEFAULT_LOCALE_DATE)
        : t('Unknown');

      const sourceNameButton = (
        <DatasetViewButton
          linkId={buildExecutionSourceButtonId(source.id)}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...source}
        />
      );

      const algorithmButton = (
        <AlgorithmViewButton
          linkId={buildExecutionAlgorithmButtonId(algorithm.id)}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...algorithm}
        />
      );

      const resultButton = (
        <ResultViewButton
          linkId={buildExecutionResultButtonId(result.id)}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...result}
        />
      );

      const statusIcon = <ExecutionStatusIcon status={status} />;

      const cancelOrRemoveButton =
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

      const quickActions = (
        <>
          <Tooltip title={t('View execution')} key="view">
            <IconButton
              id={buildExecutionViewButtonId(source.id, algorithm.id)}
              aria-label="view"
              onClick={() => this.handleView(id)}
            >
              <VisibilityIcon />
            </IconButton>
          </Tooltip>
          {cancelOrRemoveButton}
        </>
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

const mapStateToProps = ({ dataset, algorithms, executions, result }) => ({
  datasets: dataset.get('datasets'),
  isLoading:
    Boolean(dataset.getIn(['activity']).size) &&
    Boolean(algorithms.getIn(['activity']).size) &&
    Boolean(executions.get('activity').size),
  executions: executions
    .getIn(['executions'])
    .filter(({ algorithm: { type } }) =>
      [ALGORITHM_TYPES.ANONYMIZATION, ALGORITHM_TYPES.PIPELINE].includes(type),
    ),
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
