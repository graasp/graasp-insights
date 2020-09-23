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
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import Main from './common/Main';
import Loader from './common/Loader';
import {
  DATASETS_TABLE_COLUMNS,
  DEFAULT_LOCALE_DATE,
  ORDER_BY,
} from '../config/constants';
import { sortByKey } from '../utils/sorting';
import { getDatasets } from '../actions';
import { LOAD_DATASET_PATH } from '../config/paths';

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
    classes: PropTypes.shape({
      addButton: PropTypes.string.isRequired,
      columnName: PropTypes.string.isRequired,
    }).isRequired,
    t: PropTypes.func.isRequired,
    datasets: PropTypes.instanceOf(List),
  };

  static defaultProps = {
    datasets: List(),
  };

  componentDidMount() {
    const { dispatchGetDatasets } = this.props;
    dispatchGetDatasets();
  }

  handlePublish = () => {
    // TODO: implement publish functionality
  };

  handleAnonymize = () => {
    // TODO: implement anonymize functionality
  };

  handleEdit = () => {
    // TODO: implement edit functionality
  };

  handleDelete = () => {
    // TODO: implement delete functionality
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
      const sizeString = size ? `${size}${t('KB')}` : t('unknown');
      const createdAtString = createdAt
        ? new Date(createdAt).toLocaleString(DEFAULT_LOCALE_DATE)
        : t('unknown');
      const lastModifiedString = lastModified
        ? new Date(lastModified).toLocaleString(DEFAULT_LOCALE_DATE)
        : t('unknown');
      return (
        <TableRow key={dataset.name}>
          <TableCell>
            <Typography variant="h6">{name}</Typography>
            <Typography>{description}</Typography>
          </TableCell>
          <TableCell align="right">{sizeString}</TableCell>
          <TableCell align="right">{createdAtString}</TableCell>
          <TableCell align="right">{lastModifiedString}</TableCell>
          <TableCell align="right">
            <IconButton
              aria-label="publish"
              onClick={() => this.handlePublish(dataset)}
            >
              <PublishIcon />
            </IconButton>
            {!dataset.anonymized && (
              <IconButton
                aria-label="anonymize"
                onClick={() => this.handleAnonymize(dataset)}
              >
                <EqualizerIcon />
              </IconButton>
            )}
            <IconButton
              aria-label="edit"
              onClick={() => this.handleEdit(dataset)}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              aria-label="delete"
              onClick={() => this.handleDelete(dataset)}
            >
              <DeleteIcon />
            </IconButton>
          </TableCell>
        </TableRow>
      );
    });
  };

  render() {
    const { isAsc, orderBy } = this.state;
    const { classes, t, datasets } = this.props;

    if (!datasets) {
      return <Loader />;
    }

    if (!datasets.size) {
      return <Main fullscreen>{t('No datasets available')}</Main>;
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
                <TableCell align="right" />
              </TableRow>
            </TableHead>
            <TableBody>{this.renderDatasetsContent()}</TableBody>
          </Table>
          <IconButton
            variant="contained"
            aria-label="add"
            className={classes.addButton}
            onClick={this.handleAdd}
          >
            <AddIcon />
          </IconButton>
        </Container>
      </Main>
    );
  }
}

const mapStateToProps = ({ dataset }) => ({
  datasets: dataset.getIn(['datasets']),
});

const mapDispatchToProps = {
  dispatchGetDatasets: getDatasets,
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
