import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { withStyles, TableCell, TableRow } from '@material-ui/core/';
import { List } from 'immutable';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Alert from '@material-ui/lab/Alert';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import PublishIcon from '@material-ui/icons/Publish';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Main from './common/Main';
import Loader from './common/Loader';
import { DEFAULT_LOCALE_DATE } from '../config/constants';
import {
  getResults,
  deleteResult,
  getAlgorithms,
  getPipelines,
} from '../actions';
import { buildResultPath } from '../config/paths';
import Table from './common/Table';
import { formatFileSize } from '../shared/formatting';
import ExportButton from './common/ExportButton';
import { EXPORT_RESULT_CHANNEL } from '../shared/channels';
import { FLAG_EXPORTING_RESULT } from '../shared/types';
import {
  buildExecutionCollapsePipelineButtonId,
  RESULTS_MAIN_ID,
} from '../config/selectors';
import ViewDatasetButton from './dataset/ViewDatasetButton';
import LocationPathAlert from './common/LocationPathAlert';
import SchemaTags from './common/SchemaTags';
import { ALGORITHM_TYPES } from '../shared/constants';

const styles = (theme) => ({
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
});

class Results extends Component {
  state = {
    collapsePipeline: [],
    newResults: [],
  };

  static propTypes = {
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
    dispatchGetResults: PropTypes.func.isRequired,
    dispatchDeleteResult: PropTypes.func.isRequired,
    dispatchGetAlgorithms: PropTypes.func.isRequired,
    dispatchGetPipelines: PropTypes.func.isRequired,
    classes: PropTypes.shape({
      addButton: PropTypes.string.isRequired,
      infoAlert: PropTypes.string.isRequired,
    }).isRequired,
    t: PropTypes.func.isRequired,
    results: PropTypes.instanceOf(List),
    algorithms: PropTypes.instanceOf(List),
    pipelines: PropTypes.instanceOf(List),
    activity: PropTypes.bool.isRequired,
    folder: PropTypes.string,
  };

  static defaultProps = {
    results: List(),
    algorithms: List(),
    pipelines: List(),
    folder: null,
  };

  componentDidMount() {
    const {
      dispatchGetResults,
      dispatchGetAlgorithms,
      dispatchGetPipelines,
    } = this.props;
    dispatchGetResults();
    dispatchGetAlgorithms();
    dispatchGetPipelines();
  }

  componentDidUpdate({ results: prevResults }) {
    const { results } = this.props;
    if (!prevResults.equals(results)) {
      const pipelineResults = results
        .filter((result) => result.pipelineExecutionId)
        .toArray();

      const uniquePipelineExecutionIds = [
        ...new Set(pipelineResults.map((res) => res.pipelineExecutionId)),
      ];
      const missingResults = results
        .filter((result) => !result.pipelineExecutionId)
        .toArray();
      const newResults = [
        ...uniquePipelineExecutionIds.map((pipelineExecutionId) =>
          pipelineResults.filter(
            (res) => res.pipelineExecutionId === pipelineExecutionId,
          ),
        ),
        ...missingResults.map((res) => [res]),
      ];

      this.updateResultState(newResults);
    }
  }

  updateResultState = (newResults) => {
    this.setState((prevState) => ({
      ...prevState,
      collapsePipeline:
        newResults.length !== prevState.collapsePipeline.length
          ? new Array(newResults.length).fill(false)
          : prevState.collapsePipeline,
      newResults,
    }));
  };

  handleView = ({ id }) => {
    const {
      history: { push },
    } = this.props;
    push(buildResultPath(id));
  };

  handlePublish = () => {
    // TODO: implement publish functionality
  };

  handleEdit = () => {
    // TODO: implement edit functionality
  };

  handleDelete = ({ id, name }) => {
    const { dispatchDeleteResult } = this.props;
    dispatchDeleteResult({ id, name });
  };

  render() {
    const {
      activity,
      classes,
      t,
      results,
      algorithms,
      folder,
      pipelines,
    } = this.props;

    const { newResults, collapsePipeline } = this.state;
    if (activity || !results) {
      return (
        <Main fullScreen>
          <Loader />
        </Main>
      );
    }

    if (!results.size) {
      return (
        <Main>
          <Alert severity="info" className={classes.infoAlert}>
            {t('No results available')}
          </Alert>
        </Main>
      );
    }

    const columns = [
      {
        columnName: null,
        sortBy: 'collapse',
        field: 'collapse',
        alignColumn: 'left',
        alignField: 'left',
      },
      {
        columnName: t('Name'),
        sortBy: 'name',
        field: 'result',
        alignColumn: 'left',
        alignField: 'left',
      },
      {
        columnName: t('From Algorithm'),
        sortBy: 'algorithmName',
        field: 'algorithmName',
        alignColumn: 'left',
        alignField: 'left',
      },
      {
        columnName: t('Size'),
        sortBy: 'sizeNumeric',
        field: 'size',
        alignColumn: 'right',
        alignField: 'right',
      },
      {
        columnName: t('Created'),
        sortBy: 'createdAt',
        field: 'createdAt',
        alignColumn: 'right',
        alignField: 'right',
      },
      {
        columnName: t('Last Modified'),
        sortBy: 'lastModified',
        field: 'lastModified',
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
      size,
      createdAt,
      lastModified,
      algorithmId,
      pipelineId,
    }) => {
      return {
        sizeString: size ? `${formatFileSize(size)}` : t('Unknown'),
        createdAtString: createdAt
          ? new Date(createdAt).toLocaleString(DEFAULT_LOCALE_DATE)
          : t('Unknown'),
        lastModifiedString: lastModified
          ? new Date(lastModified).toLocaleString(DEFAULT_LOCALE_DATE)
          : t('Unknown'),
        algorithmName: pipelineId
          ? pipelines.find(({ id }) => id === pipelineId)?.name
          : algorithms.find(({ id: resultId }) => resultId === algorithmId)
              ?.name,
      };
    };

    const rows = newResults.map((result, resultIdx) => {
      const lastResult = result[result.length - 1];
      const isSimpleResult = result.length === 1;

      // take the last result from a pipeline
      // or either the result of an algorithm
      const {
        id,
        name,
        size,
        lastModified,
        createdAt,
        algorithmId,
        description = '',
        pipelineId,
        schemaIds,
        isTabular,
      } = lastResult;

      const {
        sizeString,
        createdAtString,
        lastModifiedString,
        algorithmName,
      } = buildTableColumns({
        size,
        createdAt,
        lastModified,
        algorithmId,
        pipelineId,
      });

      const resultPipelineTable = result.map((res) => {
        const {
          id: idResult,
          name: nameResult,
          size: sizeResult,
          lastModified: lastModifiedResult,
          createdAt: createdAtResult,
          algorithmId: algorithmResultId,
          description: descriptionResult = '',
          schemaIds: schemaResultIds,
        } = res;

        const {
          sizeString: sizeStringResult,
          createdAtString: createdAtStringResult,
          lastModifiedString: lastModifiedStringResult,
          algorithmName: algorithmNameResult,
        } = buildTableColumns({
          size: sizeResult,
          createdAt: createdAtResult,
          lastModified: lastModifiedResult,
          algorithmId: algorithmResultId,
        });

        return {
          key: idResult,
          name: nameResult,
          algorithmName: algorithmNameResult,
          result: (
            <>
              <Grid container alignItems="center" spacing={1}>
                <Grid item>
                  <Typography variant="subtitle1" key="name">
                    {nameResult}
                  </Typography>
                </Grid>
                <SchemaTags schemaIds={schemaResultIds} />
              </Grid>
              <Typography variant="caption" key="description">
                {descriptionResult}
              </Typography>
            </>
          ),
          size: sizeStringResult,
          sizeNumeric: sizeResult,
          createdAt: createdAtStringResult,
          lastModified: lastModifiedStringResult,
          quickActions: [
            <ViewDatasetButton
              tooltip={t('View result')}
              key="view"
              dataset={res}
            />,
            <ExportButton
              id={id}
              name={`${name}.json`}
              flagType={FLAG_EXPORTING_RESULT}
              channel={EXPORT_RESULT_CHANNEL}
              tooltipText={t('Export result')}
            />,
            <Tooltip title={t('Remove result')} key="delete">
              <IconButton
                aria-label="delete"
                onClick={() => this.handleDelete(res)}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>,
            <Tooltip title={t('Edit result')} key="edit">
              <IconButton
                disabled
                aria-label="edit"
                onClick={() => this.handleEdit(res)}
              >
                <EditIcon />
              </IconButton>
            </Tooltip>,
            <Tooltip title={t('Publish result')} key="publish">
              <IconButton
                disabled
                aria-label="publish"
                onClick={() => this.handlePublish(res)}
              >
                <PublishIcon />
              </IconButton>
            </Tooltip>,
          ],
        };
      });

      const collapse =
        result.length > 1 ? (
          <IconButton
            aria-label="expand row"
            size="small"
            id={buildExecutionCollapsePipelineButtonId(resultIdx)}
            onClick={() => {
              const switchCollapsePipeline = [...collapsePipeline];
              switchCollapsePipeline[resultIdx] = !switchCollapsePipeline[
                resultIdx
              ];
              this.setState(() => {
                return { collapsePipeline: switchCollapsePipeline };
              });
            }}
          >
            {collapsePipeline[resultIdx] ? (
              <KeyboardArrowDownIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        ) : null;

      const subContent =
        collapsePipeline[resultIdx] && result.length > 1
          ? resultPipelineTable.map((row) => {
              const { key, className } = row;
              return (
                <TableRow key={key} className={className}>
                  {columns
                    .filter(({ field }) => field)
                    .map(({ field, alignField, fieldColSpan }) => {
                      return (
                        <TableCell
                          align={alignField}
                          key={field}
                          colSpan={fieldColSpan}
                        >
                          {row[field]}
                        </TableCell>
                      );
                    })}
                </TableRow>
              );
            })
          : null;

      return {
        key: id,
        name,
        algorithmName,
        collapse,
        result: (
          <>
            <Grid container alignItems="center" spacing={1}>
              <Grid item>
                <Typography variant="subtitle1" key="name">
                  {name}
                </Typography>
              </Grid>
              <SchemaTags schemaIds={schemaIds} />
            </Grid>
            <Typography variant="caption" key="description">
              {description}
            </Typography>
          </>
        ),
        size: sizeString,
        sizeNumeric: size,
        createdAt: createdAtString,
        lastModified: lastModifiedString,
        quickActions: [
          <ViewDatasetButton
            tooltip={t('View result')}
            key="view"
            dataset={lastResult}
          />,
          <ExportButton
            id={id}
            name={name}
            flagType={FLAG_EXPORTING_RESULT}
            channel={EXPORT_RESULT_CHANNEL}
            isTabular={isTabular}
            tooltipText={t('Export result')}
          />,
          isSimpleResult ? (
            <Tooltip title={t('Remove result')} key="delete">
              <IconButton
                aria-label="delete"
                onClick={() => this.handleDelete(lastResult)}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          ) : null,
          <Tooltip title={t('Edit result')} key="edit">
            <IconButton
              disabled
              aria-label="edit"
              onClick={() => {
                this.handleEdit(lastResult);
              }}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>,
          <Tooltip title={t('Publish result')} key="publish">
            <IconButton
              disabled
              aria-label="publish"
              onClick={() => {
                this.handlePublish(lastResult);
              }}
            >
              <PublishIcon />
            </IconButton>
          </Tooltip>,
        ],
        subContent,
      };
    });

    return (
      <Main id={RESULTS_MAIN_ID}>
        <Container>
          {folder && (
            <LocationPathAlert
              text={t('Results are saved in your computer at')}
              path={folder}
            />
          )}
          <h1>{t('Results')}</h1>
          <Table columns={columns} rows={rows} />
        </Container>
      </Main>
    );
  }
}

const mapStateToProps = ({ result, algorithms, pipeline }) => ({
  results: result.getIn(['results']),
  algorithms: algorithms
    .get('algorithms')
    .filter(({ type }) => type === ALGORITHM_TYPES.ANONYMIZATION),
  pipelines: pipeline.get('pipelines'),
  activity: Boolean(result.get('activity').size),
  folder: result.getIn(['folder']),
});

const mapDispatchToProps = {
  dispatchGetResults: getResults,
  dispatchGetAlgorithms: getAlgorithms,
  dispatchDeleteResult: deleteResult,
  dispatchGetPipelines: getPipelines,
};

const ConnectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Results);
const StyledComponent = withStyles(styles, { withTheme: true })(
  ConnectedComponent,
);
const TranslatedComponent = withTranslation()(StyledComponent);

export default withRouter(TranslatedComponent);
