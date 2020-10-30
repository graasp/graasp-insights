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
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import Editor from '../common/Editor';
import Loader from '../common/Loader';
import Main from '../common/Main';
import { getAlgorithm, saveAlgorithm } from '../../actions';

const styles = (theme) => ({
  button: {
    margin: theme.spacing(1),
  },
  infoAlert: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
});

class EditAlgorithm extends Component {
  state = {
    name: '',
    description: '',
    author: '',
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
    classes: PropTypes.shape({
      button: PropTypes.string.isRequired,
      infoAlert: PropTypes.string.isRequired,
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
        author: algorithm.get('author'),
        code: algorithm.get('code'),
      });
    }
  }

  handleNameOnChange = (event) => {
    this.setState({ name: event.target.value });
  };

  handleDescriptionOnChange = (event) => {
    this.setState({ description: event.target.value });
  };

  handleAuthorOnChange = (event) => {
    this.setState({ author: event.target.value });
  };

  handleCodeOnChange = (code) => {
    this.setState({ code });
  };

  handleBack = () => {
    const {
      history: { goBack },
    } = this.props;
    goBack();
  };

  handleSave = () => {
    const { dispatchSaveAlgorithm, algorithm } = this.props;
    const { name, description, author, code } = this.state;
    const metadata = { ...algorithm?.toObject(), name, description, author };
    if (name) {
      dispatchSaveAlgorithm({ metadata, code });
    }
  };

  renderBackButton = () => {
    const { classes, t } = this.props;

    return (
      <Button
        variant="contained"
        color="primary"
        className={classes.button}
        startIcon={<ArrowBackIcon />}
        onClick={this.handleBack}
      >
        {t('Back')}
      </Button>
    );
  };

  render() {
    const { t, classes, algorithm, activity } = this.props;
    const { name, description, author, code } = this.state;

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
            {this.renderBackButton()}
          </Container>
        </Main>
      );
    }

    return (
      <Main>
        <Container>
          <h1>{t('Edit algorithm')}</h1>
          <Grid container spacing={2} justify="center">
            <Grid item xs={7}>
              <Editor
                programmingLanguage="python"
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
              <TextField
                margin="dense"
                label={t('Author')}
                value={author}
                onChange={this.handleAuthorOnChange}
                helperText={t('(Optional)')}
                fullWidth
              />
            </Grid>
            <Grid item>
              {this.renderBackButton()}
              <Button
                variant="contained"
                color="primary"
                className={classes.button}
                startIcon={<SaveIcon />}
                onClick={this.handleSave}
              >
                {t('Save')}
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Main>
    );
  }
}

const mapStateToProps = ({ algorithms }) => ({
  algorithm: algorithms.getIn(['current', 'content']),
  activity: algorithms.getIn(['current', 'activity']).size > 0,
});

const mapDispatchToProps = {
  dispatchGetAlgorithm: getAlgorithm,
  dispatchSaveAlgorithm: saveAlgorithm,
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
