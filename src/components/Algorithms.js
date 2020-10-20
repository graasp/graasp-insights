import React, { Component } from 'react';
import { connect } from 'react-redux';
import { List } from 'immutable';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { withTranslation } from 'react-i18next';
import Alert from '@material-ui/lab/Alert';
import Container from '@material-ui/core/Container';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Tooltip from '@material-ui/core/Tooltip';
import Main from './common/Main';
import { getAlgorithms, deleteAlgorithm } from '../actions';
import Loader from './common/Loader';
import Table from './common/Table';

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

  componentDidMount() {
    const { dispatchGetAlgorithms } = this.props;
    dispatchGetAlgorithms();
  }

  // eslint-disable-next-line class-methods-use-this
  handleEdit() {
    // TODO: implement editing functionality
  }

  handleDelete(id) {
    const { dispatchDeleteAlgorithm } = this.props;
    dispatchDeleteAlgorithm({ id });
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
          <Alert severity="info" className={classes.infoAlert}>
            {t('No algorithms are available')}
          </Alert>
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
          <Typography variant="caption" key="description">
            {description}
          </Typography>,
        ],
        author,
        language,
        quickActions: [
          <Tooltip title={t('Edit algorithm')} key="edit">
            <IconButton aria-label="edit" onClick={this.handleEdit}>
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
        <Container>
          <h1>{t('Algorithms')}</h1>
          <Table columns={columns} rows={rows} />
        </Container>
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

export default withTranslation()(StyledComponent);
