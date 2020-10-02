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
import Main from './common/Main';
import Loader from './common/Loader';
import {
  RESULTS_TABLE_COLUMNS,
  DEFAULT_LOCALE_DATE,
  ORDER_BY,
} from '../config/constants';
import { sortByKey } from '../utils/sorting';
import { getResults, deleteResult } from '../actions';
import { buildResultPath } from '../config/paths';

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

class Results extends Component {
  state = {
    isAsc: true,
    orderBy: RESULTS_TABLE_COLUMNS.NAME,
  };

  static propTypes = {
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
    dispatchGetResults: PropTypes.func.isRequired,
    dispatchDeleteResult: PropTypes.func.isRequired,
    classes: PropTypes.shape({
      addButton: PropTypes.string.isRequired,
      columnName: PropTypes.string.isRequired,
    }).isRequired,
    t: PropTypes.func.isRequired,
    results: PropTypes.instanceOf(List),
  };

  static defaultProps = {
    results: List(),
  };

  componentDidMount() {
    const { dispatchGetResults } = this.props;
    dispatchGetResults();
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

  handleAnonymize = () => {
    // TODO: implement anonymize functionality
  };

  handleEdit = () => {
    // TODO: implement edit functionality
  };

  handleDelete = (result) => {
    const { dispatchDeleteResult } = this.props;
    dispatchDeleteResult({ id: result.id });
  };

  handleSortColumn = (column) => {
    const { orderBy, isAsc } = this.state;
    if (orderBy === column) {
      this.setState({ isAsc: !isAsc });
    } else {
      this.setState({ isAsc: true, orderBy: column });
    }
  };

  renderResultsContent = () => {
    const { orderBy, isAsc } = this.state;
    const { results, t } = this.props;

    const sortedResults = sortByKey(results, orderBy, isAsc);

    return sortedResults.map((result) => {
      const {
        name,
        size,
        lastModified,
        createdAt,
        description = '',
        algorithmId,
      } = result;
      const sizeString = size ? `${size}${t('KB')}` : t('Unknown');
      const createdAtString = createdAt
        ? new Date(createdAt).toLocaleString(DEFAULT_LOCALE_DATE)
        : t('Unknown');
      const lastModifiedString = lastModified
        ? new Date(lastModified).toLocaleString(DEFAULT_LOCALE_DATE)
        : t('Unknown');
      return (
        <TableRow key={result.id}>
          <TableCell>
            <Typography variant="h6">{name}</Typography>
            <Typography>{description}</Typography>
          </TableCell>
          <TableCell align="right">{sizeString}</TableCell>
          <TableCell align="right">{algorithmId}</TableCell>
          <TableCell align="right">{createdAtString}</TableCell>
          <TableCell align="right">{lastModifiedString}</TableCell>
          <TableCell align="right">
            <IconButton>
              <CodeIcon
                aria-label="view"
                onClick={() => this.handleView(result)}
              />
            </IconButton>
            <IconButton
              aria-label="edit"
              onClick={() => this.handleEdit(result)}
            >
              <EditIcon />
            </IconButton>
            {!result.anonymized && (
              <IconButton
                aria-label="anonymize"
                onClick={() => this.handleAnonymize(result)}
              >
                <EqualizerIcon />
              </IconButton>
            )}
            <IconButton
              aria-label="publish"
              onClick={() => this.handlePublish(result)}
            >
              <PublishIcon />
            </IconButton>
            <IconButton
              aria-label="delete"
              onClick={() => this.handleDelete(result)}
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
    const { classes, t, results } = this.props;

    if (!results) {
      return <Loader />;
    }

    if (!results.size) {
      return (
        <Main fullScreen>
          <div>
            <Typography variant="h4">{t('No results available')}</Typography>
          </div>
        </Main>
      );
    }

    return (
      <Main>
        <Container>
          <h1>{t('Results')}</h1>
          <Table aria-label="table of results">
            <TableHead>
              <TableRow>
                <TableCell align="left">
                  <TableSortLabel
                    active={orderBy === RESULTS_TABLE_COLUMNS.NAME}
                    direction={
                      orderBy === RESULTS_TABLE_COLUMNS.NAME && !isAsc
                        ? ORDER_BY.DESC
                        : ORDER_BY.ASC
                    }
                    onClick={() => {
                      this.handleSortColumn(RESULTS_TABLE_COLUMNS.NAME);
                    }}
                  >
                    <Typography className={classes.columnName}>
                      {t('Name')}
                    </Typography>
                  </TableSortLabel>
                </TableCell>
                <TableCell align="right">
                  <TableSortLabel
                    active={orderBy === RESULTS_TABLE_COLUMNS.SIZE}
                    direction={
                      orderBy === RESULTS_TABLE_COLUMNS.SIZE && !isAsc
                        ? ORDER_BY.DESC
                        : ORDER_BY.ASC
                    }
                    onClick={() => {
                      this.handleSortColumn(RESULTS_TABLE_COLUMNS.SIZE);
                    }}
                  >
                    <Typography className={classes.columnName}>
                      {t('Size')}
                    </Typography>
                  </TableSortLabel>
                </TableCell>
                <TableCell align="right">
                  <TableSortLabel
                    active={orderBy === RESULTS_TABLE_COLUMNS.ALGORITHM}
                    direction={
                      orderBy === RESULTS_TABLE_COLUMNS.SCRIPT && !isAsc
                        ? ORDER_BY.DESC
                        : ORDER_BY.ASC
                    }
                    onClick={() => {
                      this.handleSortColumn(RESULTS_TABLE_COLUMNS.ALGORITHM);
                    }}
                  >
                    <Typography className={classes.columnName}>
                      {t('Result from')}
                    </Typography>
                  </TableSortLabel>
                </TableCell>
                <TableCell align="right">
                  <TableSortLabel
                    active={orderBy === RESULTS_TABLE_COLUMNS.CREATED}
                    direction={
                      orderBy === RESULTS_TABLE_COLUMNS.CREATED && !isAsc
                        ? ORDER_BY.DESC
                        : ORDER_BY.ASC
                    }
                    onClick={() => {
                      this.handleSortColumn(RESULTS_TABLE_COLUMNS.CREATED);
                    }}
                  >
                    <Typography className={classes.columnName}>
                      {t('Created')}
                    </Typography>
                  </TableSortLabel>
                </TableCell>
                <TableCell align="right">
                  <TableSortLabel
                    active={orderBy === RESULTS_TABLE_COLUMNS.LAST_MODIFIED}
                    direction={
                      orderBy === RESULTS_TABLE_COLUMNS.LAST_MODIFIED && !isAsc
                        ? ORDER_BY.DESC
                        : ORDER_BY.ASC
                    }
                    onClick={() => {
                      this.handleSortColumn(
                        RESULTS_TABLE_COLUMNS.LAST_MODIFIED,
                      );
                    }}
                  >
                    <Typography className={classes.columnName}>
                      {t('Last Modified')}
                    </Typography>
                  </TableSortLabel>
                </TableCell>
                <TableCell align="right">{t('Quick actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>{this.renderResultsContent()}</TableBody>
          </Table>
        </Container>
      </Main>
    );
  }
}

const mapStateToProps = ({ result }) => ({
  results: result.getIn(['results']),
});

const mapDispatchToProps = {
  dispatchGetResults: getResults,
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
