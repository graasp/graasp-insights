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
import IconButton from '@material-ui/core/IconButton';
import PublishIcon from '@material-ui/icons/Publish';
import EditIcon from '@material-ui/icons/Edit';
import CodeIcon from '@material-ui/icons/Code';
import DeleteIcon from '@material-ui/icons/Delete';
import Tooltip from '@material-ui/core/Tooltip';
import Alert from '@material-ui/lab/Alert';
import Main from './common/Main';
import Loader from './common/Loader';
import LoadDatasetButton from './LoadDatasetButton';
import { DEFAULT_LOCALE_DATE } from '../config/constants';
import { getDatasets, deleteDataset } from '../actions';
import { buildDatasetPath, LOAD_DATASET_PATH } from '../config/paths';
import Table from './common/Table';
import { formatFileSize } from '../utils/formatting';
import ExportButton from './common/ExportButton';
import { FLAG_EXPORTING_DATASET } from '../shared/types';
import { EXPORT_DATASET_CHANNEL } from '../shared/channels';
import {
  DATASETS_EMPTY_ALERT_ID,
  buildDatasetsListViewButtonClass,
  buildDatasetsListNameClass,
  buildDatasetsListDescriptionClass,
  buildDatasetsListDeleteButtonClass,
  DATASET_TABLE_ID,
  DATASETS_MAIN_ID,
} from '../config/selectors';
import { SCHEMA_TYPES } from '../shared/constants';
import SchemaTag from './common/SchemaTag';

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
  content: {
    // adds bottom space so that button doesn't stay above table when fully scrolled
    marginBottom: theme.spacing(10),
  },
});

class Datasets extends Component {
  static propTypes = {
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
    dispatchGetDatasets: PropTypes.func.isRequired,
    dispatchDeleteDataset: PropTypes.func.isRequired,
    classes: PropTypes.shape({
      addButton: PropTypes.string.isRequired,
      infoAlert: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
    }).isRequired,
    t: PropTypes.func.isRequired,
    datasets: PropTypes.instanceOf(List),
    isLoading: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    datasets: List(),
  };

  componentDidMount() {
    const { dispatchGetDatasets } = this.props;
    dispatchGetDatasets();
  }

  handleView = ({ id }) => {
    const {
      history: { push },
    } = this.props;
    push(buildDatasetPath(id));
  };

  handlePublish = () => {
    // TODO: implement publish functionality
  };

  handleEdit = () => {
    // TODO: implement edit functionality
  };

  handleDelete = (dataset) => {
    const { dispatchDeleteDataset } = this.props;
    dispatchDeleteDataset({ id: dataset.id });
  };

  handleAdd = () => {
    const {
      history: { push },
    } = this.props;
    push(LOAD_DATASET_PATH);
  };

  render() {
    const { classes, t, datasets, isLoading } = this.props;

    if (isLoading) {
      return (
        <Main fullScreen>
          <Loader />
        </Main>
      );
    }

    if (!datasets.size) {
      return (
        <Main id={DATASETS_MAIN_ID}>
          <Alert
            id={DATASETS_EMPTY_ALERT_ID}
            severity="info"
            className={classes.infoAlert}
          >
            {t('Add a dataset by clicking on the icon below.')}
          </Alert>
          <LoadDatasetButton />
        </Main>
      );
    }

    const columns = [
      {
        columnName: t('Name'),
        sortBy: 'name',
        field: 'dataset',
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
        columnName: t('Quick actions'),
        field: 'quickActions',
        alignColumn: 'right',
        alignField: 'right',
      },
    ];

    const rows = datasets.map((dataset) => {
      const {
        id,
        name,
        size,
        lastModified,
        createdAt,
        description = '',
        schemaType,
      } = dataset;
      const sizeString = size ? `${formatFileSize(size)}` : t('Unknown');
      const createdAtString = createdAt
        ? new Date(createdAt).toLocaleString(DEFAULT_LOCALE_DATE)
        : t('Unknown');
      const lastModifiedString = lastModified
        ? new Date(lastModified).toLocaleString(DEFAULT_LOCALE_DATE)
        : t('Unknown');
      return {
        key: id,
        name,
        dataset: (
          <>
            <Grid container alignItems="center" spacing={2}>
              <Grid item>
                <Typography
                  className={buildDatasetsListNameClass(name)}
                  variant="subtitle1"
                  key="name"
                >
                  {name}
                </Typography>
              </Grid>
              {schemaType && schemaType !== SCHEMA_TYPES.NONE && (
                <Grid item>
                  <SchemaTag schemaType={schemaType} />
                </Grid>
              )}
            </Grid>
            <Typography
              className={buildDatasetsListDescriptionClass(name)}
              variant="caption"
              key="description"
            >
              {description}
            </Typography>
          </>
        ),
        size: sizeString,
        sizeNumeric: size,
        createdAt: createdAtString,
        lastModified: lastModifiedString,
        quickActions: [
          <Tooltip title={t('View dataset')} key="view">
            <IconButton
              className={buildDatasetsListViewButtonClass(name)}
              aria-label="view"
              onClick={() => this.handleView(dataset)}
            >
              <CodeIcon />
            </IconButton>
          </Tooltip>,
          <ExportButton
            key="export"
            id={id}
            name={`${name}.json`}
            flagType={FLAG_EXPORTING_DATASET}
            channel={EXPORT_DATASET_CHANNEL}
            tooltipText={t('Export dataset')}
          />,
          <Tooltip title={t('Remove dataset')} key="delete">
            <IconButton
              className={buildDatasetsListDeleteButtonClass(name)}
              aria-label="delete"
              onClick={() => this.handleDelete(dataset)}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>,
          <Tooltip title={t('Edit dataset')} key="edit">
            <IconButton
              disabled
              aria-label="edit"
              onClick={() => this.handleEdit(dataset)}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>,
          <Tooltip title={t('Publish dataset')} key="publish">
            <IconButton
              disabled
              aria-label="publish"
              onClick={() => this.handlePublish(dataset)}
            >
              <PublishIcon />
            </IconButton>
          </Tooltip>,
        ],
      };
    });

    return (
      <Main id={DATASETS_MAIN_ID}>
        <Container className={classes.content}>
          <h1>{t('Datasets')}</h1>
          <Table id={DATASET_TABLE_ID} rows={rows} columns={columns} />
          <LoadDatasetButton />
        </Container>
      </Main>
    );
  }
}

const mapStateToProps = ({ dataset }) => ({
  datasets: dataset.getIn(['datasets']),
  isLoading: dataset.getIn(['activity']).size > 0,
});

const mapDispatchToProps = {
  dispatchGetDatasets: getDatasets,
  dispatchDeleteDataset: deleteDataset,
};

const ConnectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Datasets);
const StyledComponent = withStyles(styles, { withTheme: true })(
  ConnectedComponent,
);
const TranslatedComponent = withTranslation()(StyledComponent);

export default withRouter(TranslatedComponent);
