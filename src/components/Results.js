import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { List } from 'immutable';
import PropTypes from 'prop-types';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Alert from '@material-ui/lab/Alert';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import PublishIcon from '@material-ui/icons/Publish';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import EditIcon from '@material-ui/icons/Edit';
import CodeIcon from '@material-ui/icons/Code';
import DeleteIcon from '@material-ui/icons/Delete';
import Main from './common/Main';
import Loader from './common/Loader';
import { DEFAULT_LOCALE_DATE } from '../config/constants';
import { getResults, deleteResult, getAlgorithms } from '../actions';
import { buildResultPath } from '../config/paths';
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
  };

  static defaultProps = {
    results: List(),
    algorithms: List(),
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

  handleVisualize = () => {
    // TODO: implement anonymize functionality
  };

  handleEdit = () => {
    // TODO: implement edit functionality
  };

  handleDelete = (result) => {
    const { dispatchDeleteResult } = this.props;
    dispatchDeleteResult({ id: result.id });
  };

  render() {
    const { classes, t, results, algorithms } = this.props;

    if (!results) {
      return <Loader />;
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
        field: 'dataset',
        alignColumn: 'left',
        alignField: 'left',
      },
      {
        columnName: t('Result from'),
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
        columnName: t('Quick actions'),
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
      } = result;

      const sizeString = size ? `${size}${t('KB')}` : t('Unknown');
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
              onClick={() => this.handleView(result)}
            >
              <CodeIcon />
            </IconButton>
          </Tooltip>,
          <Tooltip title={t('Edit dataset')} key="edit">
            <IconButton
              aria-label="edit"
              onClick={() => this.handleEdit(result)}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>,
          <Tooltip title={t('Visualize dataset')} key="visualize">
            <IconButton
              aria-label="visualize"
              onClick={() => this.handleVisualize(result)}
            >
              <EqualizerIcon />
            </IconButton>
          </Tooltip>,
          <Tooltip title={t('Publish dataset')} key="publish">
            <IconButton
              aria-label="publish"
              onClick={() => this.handlePublish(result)}
            >
              <PublishIcon />
            </IconButton>
          </Tooltip>,
          <Tooltip title={t('Remove dataset')} key="delete">
            <IconButton
              aria-label="delete"
              onClick={() => this.handleDelete(result)}
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
          <h1>{t('Results')}</h1>
          <Table columns={columns} rows={rows} />
        </Container>
      </Main>
    );
  }
}

const mapStateToProps = ({ result, algorithms }) => ({
  results: result.getIn(['results']),
  algorithms: algorithms.getIn(['algorithms']),
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
