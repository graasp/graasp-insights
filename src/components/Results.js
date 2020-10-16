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
import { getResults, deleteResult } from '../actions';
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
  columnName: {
    fontWeight: 'bold',
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
    classes: PropTypes.shape({
      addButton: PropTypes.string.isRequired,
      infoAlert: PropTypes.string.isRequired,
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

  render() {
    const { classes, t, results } = this.props;

    if (!results) {
      return <Loader />;
    }

    if (!results.size) {
      return (
        <Main fullScreen>
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
        columnName: t('Result from'),
        sortBy: 'algorithmId',
        field: 'algorithmId',
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

    const rows = results.map((dataset) => {
      const {
        id,
        name,
        size,
        lastModified,
        createdAt,
        algorithmId,
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
        algorithmId,
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
          <h1>{t('Results')}</h1>
          <Table columns={columns} rows={rows} />
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
