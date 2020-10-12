import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { List } from 'immutable';
import PropTypes from 'prop-types';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
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
import {
  DATASETS_TABLE_COLUMNS,
  DEFAULT_LOCALE_DATE,
  ORDER_BY,
} from '../config/constants';
import { sortByKey } from '../utils/sorting';
import { getDatasets, deleteDataset } from '../actions';
import { buildDatasetPath, LOAD_DATASET_PATH } from '../config/paths';

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
  columnName: {
    fontWeight: 'bold',
  },
  infoAlert: {
    margin: theme.spacing(2),
  },
});

class Datasets extends Component {
  state = {
    isAsc: true,
    orderBy: DATASETS_TABLE_COLUMNS.NAME,
  };

  static propTypes = {
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
    dispatchGetDatasets: PropTypes.func.isRequired,
    dispatchDeleteDataset: PropTypes.func.isRequired,
    classes: PropTypes.shape({
      addButton: PropTypes.string.isRequired,
      columnName: PropTypes.string.isRequired,
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

  handleSortColumn = (column) => {
    const { orderBy, isAsc } = this.state;
    if (orderBy === column) {
      this.setState({ isAsc: !isAsc });
    } else {
      this.setState({ isAsc: true, orderBy: column });
    }
  };

  renderDatasetsContent = () => {
    const { orderBy, isAsc } = this.state;
    const { datasets, t } = this.props;

    const sortedDatasets = sortByKey(datasets, orderBy, isAsc);

    return sortedDatasets.map((dataset) => {
      const { name, size, lastModified, createdAt, description = '' } = dataset;
      const sizeString = size ? `${size}${t('KB')}` : t('Unknown');
      const createdAtString = createdAt
        ? new Date(createdAt).toLocaleString(DEFAULT_LOCALE_DATE)
        : t('Unknown');
      const lastModifiedString = lastModified
        ? new Date(lastModified).toLocaleString(DEFAULT_LOCALE_DATE)
        : t('Unknown');
      return (
        <TableRow key={dataset.id}>
          <TableCell>
            <Typography variant="subtitle1">{name}</Typography>
            <Typography variant="caption">{description}</Typography>
          </TableCell>
          <TableCell align="right">{sizeString}</TableCell>
          <TableCell align="right">{createdAtString}</TableCell>
          <TableCell align="right">{lastModifiedString}</TableCell>
          <TableCell align="right">
            <Tooltip title={t('View dataset')}>
              <IconButton
                aria-label="view"
                onClick={() => this.handleView(dataset)}
              >
                <CodeIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title={t('Edit dataset')}>
              <IconButton
                aria-label="edit"
                onClick={() => this.handleEdit(dataset)}
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title={t('Visualize dataset')}>
              <IconButton
                aria-label="visualize"
                onClick={() => this.handleVisualize(dataset)}
              >
                <EqualizerIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title={t('Publish dataset')}>
              <IconButton
                aria-label="publish"
                onClick={() => this.handlePublish(dataset)}
              >
                <PublishIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title={t('Remove dataset')}>
              <IconButton
                aria-label="delete"
                onClick={() => this.handleDelete(dataset)}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </TableCell>
        </TableRow>
      );
    });
  };

  render() {
    const { isAsc, orderBy } = this.state;
    const { classes, t, datasets, isLoading } = this.props;

    if (isLoading) {
      return <Loader />;
    }

    if (!datasets.size) {
      return (
        <Main fullscreen>
          <Alert severity="info" className={classes.infoAlert}>
            {t('Add a dataset by clicking on the icon below.')}
          </Alert>
          <LoadDatasetButton />
        </Main>
      );
    }

    return (
      <Main>
        <Container>
          <h1>{t('Datasets')}</h1>
          <Table aria-label="table of datasets">
            <TableHead>
              <TableRow>
                <TableCell align="left">
                  <TableSortLabel
                    active={orderBy === DATASETS_TABLE_COLUMNS.NAME}
                    direction={
                      orderBy === DATASETS_TABLE_COLUMNS.NAME && !isAsc
                        ? ORDER_BY.DESC
                        : ORDER_BY.ASC
                    }
                    onClick={() => {
                      this.handleSortColumn(DATASETS_TABLE_COLUMNS.NAME);
                    }}
                  >
                    <Typography className={classes.columnName}>
                      {t('Name')}
                    </Typography>
                  </TableSortLabel>
                </TableCell>
                <TableCell align="right">
                  <TableSortLabel
                    active={orderBy === DATASETS_TABLE_COLUMNS.SIZE}
                    direction={
                      orderBy === DATASETS_TABLE_COLUMNS.SIZE && !isAsc
                        ? ORDER_BY.DESC
                        : ORDER_BY.ASC
                    }
                    onClick={() => {
                      this.handleSortColumn(DATASETS_TABLE_COLUMNS.SIZE);
                    }}
                  >
                    <Typography className={classes.columnName}>
                      {t('Size')}
                    </Typography>
                  </TableSortLabel>
                </TableCell>
                <TableCell align="right">
                  <TableSortLabel
                    active={orderBy === DATASETS_TABLE_COLUMNS.CREATED}
                    direction={
                      orderBy === DATASETS_TABLE_COLUMNS.CREATED && !isAsc
                        ? ORDER_BY.DESC
                        : ORDER_BY.ASC
                    }
                    onClick={() => {
                      this.handleSortColumn(DATASETS_TABLE_COLUMNS.CREATED);
                    }}
                  >
                    <Typography className={classes.columnName}>
                      {t('Created')}
                    </Typography>
                  </TableSortLabel>
                </TableCell>
                <TableCell align="right">
                  <TableSortLabel
                    active={orderBy === DATASETS_TABLE_COLUMNS.LAST_MODIFIED}
                    direction={
                      orderBy === DATASETS_TABLE_COLUMNS.LAST_MODIFIED && !isAsc
                        ? ORDER_BY.DESC
                        : ORDER_BY.ASC
                    }
                    onClick={() => {
                      this.handleSortColumn(
                        DATASETS_TABLE_COLUMNS.LAST_MODIFIED,
                      );
                    }}
                  >
                    <Typography className={classes.columnName}>
                      {t('Last Modified')}
                    </Typography>
                  </TableSortLabel>
                </TableCell>
                <TableCell align="right">
                  <Typography className={classes.columnName}>
                    {t('Quick actions')}
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>{this.renderDatasetsContent()}</TableBody>
          </Table>
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
