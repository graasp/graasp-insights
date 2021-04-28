import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
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
import Main from './common/Main';
import Loader from './common/Loader';
import { DEFAULT_LOCALE_DATE } from '../config/constants';
import { getResults, deleteResult, getAlgorithms } from '../actions';
import { buildResultPath } from '../config/paths';
import Table from './common/Table';
import { formatFileSize } from '../shared/formatting';
import ExportButton from './common/ExportButton';
import { EXPORT_RESULT_CHANNEL } from '../shared/channels';
import { FLAG_EXPORTING_RESULT } from '../shared/types';
import { RESULTS_MAIN_ID } from '../config/selectors';
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
  static propTypes = {
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
    dispatchGetResults: PropTypes.func.isRequired,
    dispatchDeleteResult: PropTypes.func.isRequired,
    dispatchGetAlgorithms: PropTypes.func.isRequired,
    classes: PropTypes.shape({
      addButton: PropTypes.string.isRequired,
      infoAlert: PropTypes.string.isRequired,
    }).isRequired,
    t: PropTypes.func.isRequired,
    results: PropTypes.instanceOf(List),
    algorithms: PropTypes.instanceOf(List),
    activity: PropTypes.bool.isRequired,
    folder: PropTypes.string,
  };

  static defaultProps = {
    results: List(),
    algorithms: List(),
    folder: null,
  };

  componentDidMount() {
    const { dispatchGetResults, dispatchGetAlgorithms } = this.props;
    dispatchGetResults();
    dispatchGetAlgorithms();
  }

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
    const { activity, classes, t, results, algorithms, folder } = this.props;

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

    const rows = results.map((result) => {
      const {
        id,
        name,
        size,
        lastModified,
        createdAt,
        algorithmId,
        description = '',
        schemaIds,
      } = result;

      const sizeString = size ? `${formatFileSize(size)}` : t('Unknown');
      const createdAtString = createdAt
        ? new Date(createdAt).toLocaleString(DEFAULT_LOCALE_DATE)
        : t('Unknown');
      const lastModifiedString = lastModified
        ? new Date(lastModified).toLocaleString(DEFAULT_LOCALE_DATE)
        : t('Unknown');
      const algorithmName = algorithms.find(
        ({ id: resultId }) => resultId === algorithmId,
      )?.name;

      return {
        key: id,
        name,
        algorithmName,
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
            dataset={result}
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
              onClick={() => this.handleDelete(result)}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>,
          <Tooltip title={t('Edit result')} key="edit">
            <IconButton
              disabled
              aria-label="edit"
              onClick={() => this.handleEdit(result)}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>,
          <Tooltip title={t('Publish result')} key="publish">
            <IconButton
              disabled
              aria-label="publish"
              onClick={() => this.handlePublish(result)}
            >
              <PublishIcon />
            </IconButton>
          </Tooltip>,
        ],
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

const mapStateToProps = ({ result, algorithms }) => ({
  results: result.getIn(['results']),
  algorithms: algorithms
    .get('algorithms')
    .filter(({ type }) => type === ALGORITHM_TYPES.ANONYMIZATION),
  activity: Boolean(result.get('activity').size),
  folder: result.getIn(['folder']),
});

const mapDispatchToProps = {
  dispatchGetResults: getResults,
  dispatchGetAlgorithms: getAlgorithms,
  dispatchDeleteResult: deleteResult,
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
