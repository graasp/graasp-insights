import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { List } from 'immutable';
import PropTypes from 'prop-types';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import PublishIcon from '@material-ui/icons/Publish';
import EqualizerIcon from '@material-ui/icons/Equalizer';
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

  handleVisualize = () => {
    // TODO: implement visualize functionality
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
      return <Loader />;
    }

    if (!datasets.size) {
      return (
        <Main fullScreen>
          <Alert severity="info" className={classes.infoAlert}>
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
        bold: true,
      },
      {
        columnName: t('Size'),
        sortBy: 'sizeNumeric',
        field: 'size',
        alignColumn: 'right',
        alignField: 'right',
        bold: true,
      },
      {
        columnName: t('Created'),
        sortBy: 'createdAt',
        field: 'createdAt',
        alignColumn: 'right',
        alignField: 'right',
        bold: true,
      },
      {
        columnName: t('Last Modified'),
        sortBy: 'lastModified',
        field: 'lastModified',
        alignColumn: 'right',
        alignField: 'right',
        bold: true,
      },
      {
        columnName: t('Quick actions'),
        field: 'quickActions',
        alignColumn: 'right',
        alignField: 'right',
        bold: false,
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
      } = dataset;
      const sizeString = size ? `${size}${t('KB')}` : t('Unknown');
      const createdAtString = createdAt
        ? new Date(createdAt).toLocaleString(DEFAULT_LOCALE_DATE)
        : t('Unknown');
      const lastModifiedString = lastModified
        ? new Date(lastModified).toLocaleString(DEFAULT_LOCALE_DATE)
        : t('Unknown');
      return {
        key: id,
        name,
        dataset: [
          <Typography variant="subtitle1" key="name">
            {name}
          </Typography>,
          <Typography variant="caption" key="description">
            {description}
          </Typography>,
        ],
        size: sizeString,
        sizeNumeric: size,
        createdAt: createdAtString,
        lastModified: lastModifiedString,
        quickActions: [
          <Tooltip title={t('View dataset')} key="view">
            <IconButton
              aria-label="view"
              onClick={() => this.handleView(dataset)}
            >
              <CodeIcon />
            </IconButton>
          </Tooltip>,
          <Tooltip title={t('Edit dataset')} key="edit">
            <IconButton
              aria-label="edit"
              onClick={() => this.handleEdit(dataset)}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>,
          <Tooltip title={t('Visualize dataset')} key="visualize">
            <IconButton
              aria-label="visualize"
              onClick={() => this.handleVisualize(dataset)}
            >
              <EqualizerIcon />
            </IconButton>
          </Tooltip>,
          <Tooltip title={t('Publish dataset')} key="publish">
            <IconButton
              aria-label="publish"
              onClick={() => this.handlePublish(dataset)}
            >
              <PublishIcon />
            </IconButton>
          </Tooltip>,
          <Tooltip title={t('Remove dataset')} key="delete">
            <IconButton
              aria-label="delete"
              onClick={() => this.handleDelete(dataset)}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>,
        ],
      };
    });

    return (
      <Main>
        <Container>
          <h1>{t('Datasets')}</h1>
          <Table rows={rows} columns={columns} />
          <LoadDatasetButton />
        </Container>
      </Main>
    );
  }
}

const mapStateToProps = ({ dataset }) => ({
  datasets: dataset.getIn(['datasets']),
  isLoading: dataset.getIn(['current', 'activity']).size > 0,
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
