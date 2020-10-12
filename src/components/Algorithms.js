import React, { Component } from 'react';
import { connect } from 'react-redux';
import { List } from 'immutable';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { withTranslation } from 'react-i18next';
import Alert from '@material-ui/lab/Alert';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Container from '@material-ui/core/Container';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import DoubleArrowIcon from '@material-ui/icons/DoubleArrow';
import Tooltip from '@material-ui/core/Tooltip';
import Main from './common/Main';
import { getAlgorithms, deleteAlgorithm } from '../actions';
import Loader from './common/Loader';
import { sortByKey } from '../utils/sorting';
import { ALGORITHMS_TABLE_COLUMNS, ORDER_BY } from '../config/constants';

const styles = (theme) => ({
  infoAlert: {
    margin: theme.spacing(2),
  },
});

class Algorithms extends Component {
  static propTypes = {
    algorithms: PropTypes.instanceOf(List).isRequired,
    t: PropTypes.func.isRequired,
    dispatchGetAlgorithms: PropTypes.func.isRequired,
    dispatchDeleteAlgorithm: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
    classes: PropTypes.shape({
      infoAlert: PropTypes.string.isRequired,
    }).isRequired,
  };

  state = {
    isAsc: true,
    orderBy: ALGORITHMS_TABLE_COLUMNS.ALGORITHM,
  };

  componentDidMount() {
    const { dispatchGetAlgorithms } = this.props;
    dispatchGetAlgorithms();
  }

  handleSortColumn(column) {
    const { orderBy, isAsc } = this.state;
    if (orderBy === column) {
      this.setState({ isAsc: !isAsc });
    } else {
      this.setState({ isAsc: true, orderBy: column });
    }
  }

  // eslint-disable-next-line class-methods-use-this
  handleExecute() {
    // TODO: implement execute functionality
  }

  // eslint-disable-next-line class-methods-use-this
  handleEdit() {
    // TODO: implement editing functionality
  }

  handleDelete(id) {
    const { dispatchDeleteAlgorithm } = this.props;
    dispatchDeleteAlgorithm({ id });
  }

  renderTableHead() {
    const { isAsc, orderBy } = this.state;
    const { t } = this.props;

    return (
      <TableHead>
        <TableRow>
          <TableCell align="left">
            <TableSortLabel
              active={orderBy === ALGORITHMS_TABLE_COLUMNS.ALGORITHM}
              direction={
                orderBy === ALGORITHMS_TABLE_COLUMNS.ALGORITHM && !isAsc
                  ? ORDER_BY.DESC
                  : ORDER_BY.ASC
              }
              onClick={() => {
                this.handleSortColumn(ALGORITHMS_TABLE_COLUMNS.ALGORITHM);
              }}
            >
              <Typography>{t('Algorithm')}</Typography>
            </TableSortLabel>
          </TableCell>
          <TableCell align="left">
            <TableSortLabel
              active={orderBy === ALGORITHMS_TABLE_COLUMNS.AUTHOR}
              direction={
                orderBy === ALGORITHMS_TABLE_COLUMNS.AUTHOR && !isAsc
                  ? ORDER_BY.DESC
                  : ORDER_BY.ASC
              }
              onClick={() => {
                this.handleSortColumn(ALGORITHMS_TABLE_COLUMNS.AUTHOR);
              }}
            >
              <Typography>{t('Author')}</Typography>
            </TableSortLabel>
          </TableCell>
          <TableCell align="left">
            <TableSortLabel
              active={orderBy === ALGORITHMS_TABLE_COLUMNS.LANGUAGE}
              direction={
                orderBy === ALGORITHMS_TABLE_COLUMNS.LANGUAGE && !isAsc
                  ? ORDER_BY.DESC
                  : ORDER_BY.ASC
              }
              onClick={() => {
                this.handleSortColumn(ALGORITHMS_TABLE_COLUMNS.LANGUAGE);
              }}
            >
              <Typography>{t('Language')}</Typography>
            </TableSortLabel>
          </TableCell>
          <TableCell align="center">{t('Quick Actions')}</TableCell>
        </TableRow>
      </TableHead>
    );
  }

  renderTableContent() {
    const { orderBy, isAsc } = this.state;
    const { algorithms, t } = this.props;

    const sortedAlgorithms = sortByKey(algorithms, orderBy, isAsc);

    return sortedAlgorithms.map((algorithm) => {
      const { id, name, description, author, language } = algorithm;

      return (
        <TableRow key={name}>
          <TableCell>
            <Typography variant="h6">{name}</Typography>
            <Typography>{description}</Typography>
          </TableCell>
          <TableCell>{author}</TableCell>
          <TableCell>{language}</TableCell>
          <TableCell>
            <Tooltip title={t('Execute algorithm on a dataset')}>
              <IconButton aria-label="execute" onClick={this.handleExecute}>
                <DoubleArrowIcon />
              </IconButton>
            </Tooltip>
            {!author !== 'graasp' && (
              <Tooltip title={t('Edit algorithm')}>
                <IconButton aria-label="edit" onClick={this.handleEdit}>
                  <EditIcon />
                </IconButton>
              </Tooltip>
            )}
            <Tooltip title={t('Delete algorithm')}>
              <IconButton
                aria-label="delete"
                onClick={() => this.handleDelete(id)}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </TableCell>
        </TableRow>
      );
    });
  }

  renderTable() {
    return (
      <Table aria-label="table of algorithms">
        {this.renderTableHead()}
        <TableBody>{this.renderTableContent()}</TableBody>
      </Table>
    );
  }

  render() {
    const { algorithms, t, isLoading, classes } = this.props;

    if (isLoading) {
      return (
        <Main fullScreen>
          <Loader />
        </Main>
      );
    }

    if (algorithms.size <= 0) {
      return (
        <Main>
          <Container>
            <h1>{t('Algorithms')}</h1>
            <Alert severity="info" className={classes.infoAlert}>
              {t('No algorithms are available')}
            </Alert>
          </Container>
        </Main>
      );
    }

    return (
      <Main>
        <Container>
          <h1>{t('Algorithms')}</h1>
          {this.renderTable()}
        </Container>
      </Main>
    );
  }
}

const mapStateToProps = ({ dataset, algorithms }) => ({
  algorithms: algorithms.get('algorithms'),
  isLoading: dataset.getIn(['current', 'activity']).size > 0,
});

const mapDispatchToProps = {
  dispatchGetAlgorithms: getAlgorithms,
  dispatchDeleteAlgorithm: deleteAlgorithm,
};

const ConnectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Algorithms);

const StyledComponent = withStyles(styles, { withTheme: true })(
  ConnectedComponent,
);

export default withTranslation()(StyledComponent);
