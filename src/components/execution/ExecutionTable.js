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
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
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
  buildExecutionPipelineButtonId,
  buildExecutionResultButtonId,
  buildExecutionSourceButtonId,
  buildExecutionViewButtonId,
  buildExecutionCollapsePipelineButtonId,
  EXECUTIONS_EXECUTION_CANCEL_BUTTON_CLASS,
  EXECUTIONS_EXECUTION_DELETE_BUTTON_CLASS,
  EXECUTIONS_TABLE_ID,
} from '../../config/selectors';
import { ALGORITHM_TYPES, EXECUTION_STATUSES } from '../../shared/constants';
import ExecutionStatusIcon from './ExecutionStatusIcon';
import ResultViewButton from './ResultViewButton';
import AlgorithmViewButton from './AlgorithmViewButton';
import DatasetViewButton from './DatasetViewButton';
import PipelineViewButton from './PipelineViewButton';

const styles = () => ({
  link: {
    textTransform: 'none',
    textAlign: 'left',
  },
});

class ExecutionTable extends Component {
  state = {
    collapsePipeline: [],
    structuredExecutions: [],
  };

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

      const mainPipelineExecutions = executions.filter(
        (item) => !item.pipelineExecutionId,
      );

      const structuredExecutions = [...mainPipelineExecutions.toArray()];
      structuredExecutions.forEach((v) => {
        const element = v;
        element.resultPipeline = executions
          .filter((item) => item.pipelineExecutionId === v.id)
          .toArray();
        return element;
      });

      this.updateExecutionState(structuredExecutions);
    }
  }

  updateExecutionState = (structuredExecutions) => {
    this.setState((prevState) => ({
      ...prevState,
      collapsePipeline: new Array(structuredExecutions.length).fill(false),
      structuredExecutions,
    }));
  };

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
    const { structuredExecutions, collapsePipeline } = this.state;

    if (isLoading) {
      return <Loader />;
    }

    if (executions.isEmpty()) {
      return null;
    }

    const columns = [
      {
        columnName: t(''),
        sortBy: 'collapse',
        field: 'collapse',
        alignColumn: 'left',
        alignField: 'left',
      },
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

    const buildTableColumns = ({
      executedAt,
      source,
      algorithm,
      resultPipeline,
      result,
      status,
      execution,
      handleCancel,
      handleDelete,
    }) => {
      return {
        executedAtString: executedAt
          ? new Date(executedAt).toLocaleString(DEFAULT_LOCALE_DATE)
          : t('Unknown'),
        sourceNameButton: (
          <DatasetViewButton
            linkId={buildExecutionSourceButtonId(source.id)}
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...source}
          />
        ),
        algorithmButton:
          algorithm.type === ALGORITHM_TYPES.PIPELINE ? (
            <PipelineViewButton
              linkId={buildExecutionPipelineButtonId(algorithm.id)}
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...algorithm}
            />
          ) : (
            <AlgorithmViewButton
              linkId={buildExecutionAlgorithmButtonId(algorithm.id)}
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...algorithm}
            />
          ),
        resultButton:
          algorithm.type === ALGORITHM_TYPES.PIPELINE &&
          resultPipeline.length ? (
            <ResultViewButton
              linkId={buildExecutionResultButtonId(
                resultPipeline[resultPipeline.length - 1].result.id,
              )}
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...resultPipeline[resultPipeline.length - 1].result}
            />
          ) : (
            <ResultViewButton
              linkId={buildExecutionResultButtonId(result.id)}
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...result}
            />
          ),
        statusIcon: <ExecutionStatusIcon status={status} />,
        cancelOrRemoveButton:
          status === EXECUTION_STATUSES.RUNNING ? (
            <Tooltip title={t('Cancel execution')} key="cancel">
              <IconButton
                className={EXECUTIONS_EXECUTION_CANCEL_BUTTON_CLASS}
                aria-label="cancel"
                onClick={() => handleCancel(execution)}
              >
                <CancelIcon />
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip title={t('Remove execution')} key="delete">
              <IconButton
                className={EXECUTIONS_EXECUTION_DELETE_BUTTON_CLASS}
                aria-label="delete"
                onClick={() => handleDelete(execution)}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          ),
      };
    };

    const rows = structuredExecutions.map((execution, executionIdx) => {
      const {
        id,
        executedAt,
        algorithm,
        source,
        status,
        result,
        resultPipeline,
      } = execution;

      const {
        executedAtString,
        sourceNameButton,
        algorithmButton,
        resultButton,
        statusIcon,
        cancelOrRemoveButton,
      } = buildTableColumns({
        executedAt,
        source,
        algorithm,
        resultPipeline,
        result,
        status: resultPipeline.length
          ? resultPipeline[resultPipeline.length - 1].status
          : status,
        execution,
        handleDelete: this.handleDelete,
        handleCancel: this.handleCancel,
      });

      const quickActionsSourceId = !execution.resultPipeline.length
        ? source.id
        : resultPipeline[resultPipeline.length - 1].source.id;
      const quickActionsAlgorithmId = !execution.resultPipeline.length
        ? algorithm.id
        : resultPipeline[resultPipeline.length - 1].algorithm.id;
      const quickActionsId = !execution.resultPipeline.length
        ? id
        : resultPipeline[resultPipeline.length - 1].id;

      const quickActions = (
        <>
          <Tooltip title={t('View execution')} key="view">
            <IconButton
              id={buildExecutionViewButtonId(
                quickActionsSourceId,
                quickActionsAlgorithmId,
              )}
              aria-label="view"
              onClick={() => this.handleView(quickActionsId)}
            >
              <VisibilityIcon />
            </IconButton>
          </Tooltip>
          {!execution.resultPipeline.length ? cancelOrRemoveButton : <></>}
        </>
      );

      const resultPipelineTable = resultPipeline.map((exec) => {
        const columnExecution = buildTableColumns({
          executedAt: exec.executedAt,
          source: exec.source,
          algorithm: exec.algorithm,
          resultPipeline,
          result: exec.result,
          status: exec.status,
          execution: exec,
          handleDelete: this.handleDelete,
          handleCancel: this.handleCancel,
        });

        const quickActionsExecution = (
          <>
            <Tooltip title={t('View execution')} key="view">
              <IconButton
                id={buildExecutionViewButtonId(source.id, exec.algorithm.id)}
                aria-label="view"
                onClick={() => this.handleView(exec.id)}
              >
                <VisibilityIcon />
              </IconButton>
            </Tooltip>
            {columnExecution.cancelOrRemoveButton}
          </>
        );

        return {
          key: exec.id,
          sourceName: columnExecution.sourceNameButton,
          algorithmName: columnExecution.algorithmButton,
          resultId: columnExecution.resultButton,
          status: columnExecution.statusIcon,
          executedAt: columnExecution.executedAtString,
          quickActions: quickActionsExecution,
        };
      });

      return {
        key: id,
        collapse: execution.resultPipeline.length ? (
          <IconButton
            aria-label="expand row"
            size="small"
            id={buildExecutionCollapsePipelineButtonId(executionIdx)}
            onClick={() => {
              const switchCollapsePipeline = [...collapsePipeline];
              switchCollapsePipeline[executionIdx] = !switchCollapsePipeline[
                executionIdx
              ];
              this.setState(() => {
                return { collapsePipeline: switchCollapsePipeline };
              });
            }}
          >
            {collapsePipeline[executionIdx] ? (
              <KeyboardArrowUpIcon />
            ) : (
              <KeyboardArrowDownIcon />
            )}
          </IconButton>
        ) : (
          <></>
        ),
        sourceName: sourceNameButton,
        algorithmName: algorithmButton,
        resultId: resultButton,
        status: statusIcon,
        executedAt: executedAtString,
        quickActions,
        resultPipeline: resultPipelineTable,
        open: collapsePipeline[executionIdx],
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
