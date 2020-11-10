import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router';
import { Map } from 'immutable';

import TextField from '@material-ui/core/TextField';
import Container from '@material-ui/core/Container';
import Alert from '@material-ui/lab/Alert';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';

import Editor from '../common/Editor';
import Loader from '../common/Loader';
import Main from '../common/Main';
import {
  addAlgorithm,
  getAlgorithm,
  saveAlgorithm,
  clearAlgorithm,
} from '../../actions';
import {
  AUTHOR_GRAASP,
  AUTHOR_USER,
  EDITOR_PROGRAMMING_LANGUAGES,
} from '../../config/constants';
import BackButton from '../common/BackButton';
import { ALGORITHM_TYPES } from '../../shared/constants';

const styles = (theme) => ({
  infoAlert: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  backButton: {
    position: 'fixed',
    right: theme.spacing(2),
    bottom: theme.spacing(2),
  },
});

class EditAlgorithm extends Component {
  state = {
    name: '',
    description: '',
    code: '',
  };

  static propTypes = {
    algorithm: PropTypes.instanceOf(Map).isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string,
      }).isRequired,
    }).isRequired,
    history: PropTypes.shape({
      goBack: PropTypes.func.isRequired,
    }).isRequired,
    dispatchGetAlgorithm: PropTypes.func.isRequired,
    dispatchSaveAlgorithm: PropTypes.func.isRequired,
    dispatchAddAlgorithm: PropTypes.func.isRequired,
    dispatchClearAlgorithm: PropTypes.func.isRequired,
    classes: PropTypes.shape({
      infoAlert: PropTypes.string.isRequired,
      backButton: PropTypes.string.isRequired,
    }).isRequired,
    t: PropTypes.func.isRequired,
    activity: PropTypes.bool.isRequired,
  };

  componentDidMount() {
    const {
      dispatchGetAlgorithm,
      match: {
        params: { id },
      },
    } = this.props;

    dispatchGetAlgorithm({ id });
  }

  componentDidUpdate({ algorithm: prevAlgorithm }) {
    const { algorithm } = this.props;
    if (algorithm && algorithm !== prevAlgorithm) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        name: algorithm.get('name'),
        description: algorithm.get('description'),
        code: algorithm.get('code'),
      });
    }
  }

  componentWillUnmount() {
    const { dispatchClearAlgorithm } = this.props;
    dispatchClearAlgorithm();
  }

  handleNameOnChange = (event) => {
    this.setState({ name: event.target.value });
  };

  handleDescriptionOnChange = (event) => {
    this.setState({ description: event.target.value });
  };

  handleCodeOnChange = (code) => {
    this.setState({ code });
  };

  handleSave = () => {
    const {
      dispatchSaveAlgorithm,
      dispatchAddAlgorithm,
      algorithm,
      history: { goBack },
    } = this.props;
    const { name, description, code } = this.state;
    if (algorithm && name) {
      const author = algorithm.get('author');
      const type = algorithm.get('type');

      if (author === AUTHOR_GRAASP && type !== ALGORITHM_TYPES.UTILS) {
        // add as a new algorithm instead
        const payload = { name, description, author: AUTHOR_USER, code };
        const onSuccess = goBack;
        dispatchAddAlgorithm({ payload, onSuccess });
      } else {
        const metadata = { ...algorithm?.toObject(), name, description };
        dispatchSaveAlgorithm({ metadata, code });
      }
    }
  };

  render() {
    const { t, classes, algorithm, activity } = this.props;
    const { name, description, code } = this.state;

    if (activity) {
      return (
        <Main fullScreen>
          <Loader />
        </Main>
      );
    }

    if (!algorithm || algorithm.isEmpty()) {
      return (
        <Main>
          <Container>
            <Alert severity="error" className={classes.infoAlert}>
              {t('An unexpected error happened while opening the algorithm.')}
            </Alert>
            <BackButton />
          </Container>
        </Main>
      );
    }

    const author = algorithm.get('author');
    const type = algorithm.get('type');

    return (
      <Main>
        <Container>
          <h1>{t('Edit algorithm')}</h1>
          {author === AUTHOR_GRAASP && type !== ALGORITHM_TYPES.UTILS && (
            <Alert severity="info" className={classes.infoAlert}>
              {t(
                `You are modifying a Graasp algorithm. Saving will create a new file instead.`,
              )}
            </Alert>
          )}
          <Grid container spacing={2} justify="center">
            <Grid item xs={7}>
              <Editor
                programmingLanguage={EDITOR_PROGRAMMING_LANGUAGES.PYTHON}
                code={code}
                onCodeChange={this.handleCodeOnChange}
              />
            </Grid>
            <Grid item xs={5}>
              <TextField
                margin="dense"
                label={t('Algorithm name')}
                value={name}
                onChange={this.handleNameOnChange}
                helperText={t('(Required)')}
                required
                fullWidth
              />
              <TextField
                margin="dense"
                label={t('Description')}
                value={description}
                onChange={this.handleDescriptionOnChange}
                multiline
                rowsMax={4}
                helperText={t('(Optional)')}
                fullWidth
              />
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                startIcon={<SaveIcon />}
                onClick={this.handleSave}
                disabled={!name}
              >
                {t('Save')}
              </Button>
            </Grid>
          </Grid>
        </Container>
        <BackButton className={classes.backButton} />
      </Main>
    );
  }
}

const mapStateToProps = ({ algorithms }) => ({
  algorithm: algorithms.getIn(['current', 'content']),
  activity: Boolean(algorithms.getIn(['current', 'activity']).size),
});

const mapDispatchToProps = {
  dispatchGetAlgorithm: getAlgorithm,
  dispatchSaveAlgorithm: saveAlgorithm,
  dispatchAddAlgorithm: addAlgorithm,
  dispatchClearAlgorithm: clearAlgorithm,
};

const ConnectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps,
)(EditAlgorithm);

const StyledComponent = withStyles(styles, { withTheme: true })(
  ConnectedComponent,
);

const TranslatedComponent = withTranslation()(StyledComponent);

export default withRouter(TranslatedComponent);
