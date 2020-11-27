import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import SaveIcon from '@material-ui/icons/Save';
import Alert from '@material-ui/lab/Alert';
import { Map } from 'immutable';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import {
  addAlgorithm,
  clearAlgorithm,
  getAlgorithm,
  saveAlgorithm,
} from '../../actions';
import { EDITOR_PROGRAMMING_LANGUAGES } from '../../config/constants';
import {
  EDIT_ALGORITHM_BACK_BUTTON_ID,
  EDIT_ALGORITHM_DESCRIPTION_ID,
  EDIT_ALGORITHM_MAIN_ID,
  EDIT_ALGORITHM_NAME_ID,
  EDIT_ALGORITHM_SAVE_BUTTON_ID,
} from '../../config/selectors';
import { AUTHORS } from '../../shared/constants';
import { areParametersValid, setParametersInCode } from '../../utils/parameter';
import BackButton from '../common/BackButton';
import Editor from '../common/Editor';
import Loader from '../common/Loader';
import Main from '../common/Main';
import EditParameters from '../parameter/EditParameters';

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
    parameters: [],
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
        name: algorithm.get('name', ''),
        description: algorithm.get('description', ''),
        code: algorithm.get('code', ''),
        parameters: algorithm.get('parameters', []),
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

  handleParamsOnChange = (parameters) => {
    const { code } = this.state;
    this.setState({ parameters, code: setParametersInCode(code, parameters) });
  };

  handleSave = () => {
    const {
      dispatchSaveAlgorithm,
      dispatchAddAlgorithm,
      algorithm,
      history: { goBack },
    } = this.props;
    const { name, description, code, parameters } = this.state;
    if (algorithm && name) {
      const id = algorithm.get('id');
      const author = algorithm.get('author');
      const filepath = algorithm.get('filepath');

      if (author === AUTHORS.GRAASP) {
        // add as a new algorithm instead
        const payload = {
          name,
          description,
          author: AUTHORS.USER,
          code,
          parameters,
        };
        const onSuccess = goBack;
        dispatchAddAlgorithm({ payload, onSuccess });
      } else {
        const metadata = {
          id,
          filepath,
          name,
          description,
          parameters,
        };
        dispatchSaveAlgorithm({ metadata, code });
      }
    }
  };

  isValid = () => {
    const { name, parameters } = this.state;
    return name && areParametersValid(parameters);
  };

  render() {
    const { t, classes, algorithm, activity } = this.props;
    const { name, description, code, parameters } = this.state;

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

    return (
      <Main id={EDIT_ALGORITHM_MAIN_ID}>
        <Container>
          <h1>{t('Edit Algorithm')}</h1>
          {author === AUTHORS.GRAASP && (
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
                onSave={() => this.isValid() && this.handleSave()}
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
                id={EDIT_ALGORITHM_NAME_ID}
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
                id={EDIT_ALGORITHM_DESCRIPTION_ID}
              />
              <EditParameters
                parameters={parameters}
                onChange={this.handleParamsOnChange}
              />
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                startIcon={<SaveIcon />}
                onClick={this.handleSave}
                id={EDIT_ALGORITHM_SAVE_BUTTON_ID}
                disabled={!this.isValid()}
              >
                {t('Save')}
              </Button>
            </Grid>
          </Grid>
        </Container>
        <BackButton
          className={classes.backButton}
          id={EDIT_ALGORITHM_BACK_BUTTON_ID}
        />
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
