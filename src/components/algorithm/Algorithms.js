import React, { Component } from 'react';
import { connect } from 'react-redux';
import { List } from 'immutable';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { withTranslation } from 'react-i18next';
import { withRouter } from 'react-router';
import Alert from '@material-ui/lab/Alert';
import Container from '@material-ui/core/Container';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
import Main from '../common/Main';
import { getAlgorithms, deleteAlgorithm } from '../../actions';
import Loader from '../common/Loader';
import Table from '../common/Table';
import {
  buildEditAlgorithmPath,
  ADD_ALGORITHM_PATH,
  EDIT_UTILS_PATH,
} from '../../config/paths';

const styles = (theme) => ({
  infoAlert: {
    margin: theme.spacing(2),
  },
  description: {
    display: 'block',
    maxWidth: '600px',
  },
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
  content: {
    // adds bottom space so that button doesn't stay above table when fully scrolled
    marginBottom: theme.spacing(10),
  },
  utilsButton: {
    float: 'right',
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
      description: PropTypes.string.isRequired,
      addButton: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
      utilsButton: PropTypes.string.isRequired,
    }).isRequired,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
  };

  componentDidMount() {
    const { dispatchGetAlgorithms } = this.props;
    dispatchGetAlgorithms();
  }

  handleAdd = () => {
    const {
      history: { push },
    } = this.props;
    push(ADD_ALGORITHM_PATH);
  };

  handleDelete(id) {
    const { dispatchDeleteAlgorithm } = this.props;
    dispatchDeleteAlgorithm({ id });
  }

  handleEdit(id) {
    const {
      history: { push },
    } = this.props;
    push(buildEditAlgorithmPath(id));
  }

  handleUtilsEdit() {
    const {
      history: { push },
    } = this.props;
    push(EDIT_UTILS_PATH);
  }

  renderAddButon() {
    const { classes } = this.props;
    return (
      <IconButton
        variant="contained"
        className={classes.addButton}
        onClick={this.handleAdd}
      >
        <AddIcon />
      </IconButton>
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

    if (!algorithms.size) {
      return (
        <Main>
          <Alert severity="info" className={classes.infoAlert}>
            {t('No algorithms are available')}
          </Alert>
          {this.renderAddButon()}
        </Main>
      );
    }

    const columns = [
      {
        columnName: t('Algorithm'),
        sortBy: 'name',
        field: 'algorithm',
        alignColumn: 'left',
        alignField: 'left',
      },
      {
        columnName: t('Author'),
        sortBy: 'author',
        field: 'author',
        alignColumn: 'left',
        alignField: 'left',
      },
      {
        columnName: t('Language'),
        sortBy: 'language',
        field: 'language',
        alignColumn: 'left',
        alignField: 'left',
      },
      {
        columnName: t('Quick actions'),
        field: 'quickActions',
        alignColumn: 'right',
        alignField: 'right',
      },
    ];

    const rows = algorithms.map((algorithm) => {
      const { id, name, description, author, language } = algorithm;
      return {
        key: id,
        name,
        algorithm: [
          <Typography variant="subtitle1" key="name">
            {name}
          </Typography>,
          <Typography
            variant="caption"
            key="description"
            className={classes.description}
          >
            {description}
          </Typography>,
        ],
        author,
        language,
        quickActions: [
          <Tooltip title={t('Edit Algorithm')} key="edit">
            <IconButton aria-label="edit" onClick={() => this.handleEdit(id)}>
              <EditIcon />
            </IconButton>
          </Tooltip>,
          <Tooltip title={t('Delete algorithm')} key="delete">
            <IconButton
              aria-label="delete"
              onClick={() => this.handleDelete(id)}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>,
        ],
      };
    });

    return (
      <Main>
        <Container className={classes.content}>
          <Tooltip
            title={t(
              "You can use the 'utils' file to write functions you want to use across your custom algorithms",
            )}
          >
            <Button
              variant="contained"
              color="primary"
              className={classes.utilsButton}
              onClick={() => this.handleUtilsEdit()}
            >
              {t('Edit utils')}
            </Button>
          </Tooltip>
          <h1>{t('Algorithms')}</h1>
          <Table columns={columns} rows={rows} />
        </Container>
        {this.renderAddButon()}
      </Main>
    );
  }
}

const mapStateToProps = ({ algorithms }) => ({
  algorithms: algorithms.get('algorithms'),
  isLoading: algorithms.getIn(['activity']).size > 0,
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

const TranslatedComponent = withTranslation()(StyledComponent);

export default withRouter(TranslatedComponent);
