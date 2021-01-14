import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router';

import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Alert from '@material-ui/lab/Alert';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import SaveIcon from '@material-ui/icons/Save';

import PythonEditor from '../common/editor/PythonEditor';
import Loader from '../common/Loader';
import Main from '../common/Main';
import { getUtils, saveUtils } from '../../actions';
import { UTILS_FILES } from '../../config/constants';
import BackButton from '../common/BackButton';

const styles = (theme) => ({
  backButton: {
    position: 'fixed',
    right: theme.spacing(2),
    bottom: theme.spacing(2),
  },
  saveButton: {
    textAlign: 'center',
  },
});

class EditAlgorithm extends Component {
  state = (() => {
    const { userUtils } = this.props;
    return {
      userUtils,
      displayedUtils: UTILS_FILES.USER,
    };
  })();

  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string,
      }).isRequired,
    }).isRequired,
    history: PropTypes.shape({
      goBack: PropTypes.func.isRequired,
    }).isRequired,
    dispatchGetUtils: PropTypes.func.isRequired,
    dispatchSaveUtils: PropTypes.func.isRequired,
    classes: PropTypes.shape({
      backButton: PropTypes.string.isRequired,
      saveButton: PropTypes.string.isRequired,
    }).isRequired,
    t: PropTypes.func.isRequired,
    activity: PropTypes.bool.isRequired,
    userUtils: PropTypes.string.isRequired,
    graaspUtils: PropTypes.string.isRequired,
  };

  componentDidMount() {
    const { dispatchGetUtils } = this.props;
    dispatchGetUtils();
  }

  componentDidUpdate({ userUtils: prevUserUtils }) {
    const { userUtils } = this.props;
    if (userUtils !== prevUserUtils) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ userUtils });
    }
  }

  handleUserCodeOnChange = (code) => {
    this.setState({ userUtils: code });
  };

  handleSave = () => {
    const { dispatchSaveUtils } = this.props;
    const { userUtils } = this.state;

    dispatchSaveUtils(userUtils);
  };

  render() {
    const { t, classes, graaspUtils, activity } = this.props;
    const { userUtils, displayedUtils } = this.state;

    if (activity) {
      return (
        <Main fullScreen>
          <Loader />
        </Main>
      );
    }

    return (
      <Main>
        <Container>
          <h1>{t('Edit utils')}</h1>
          <Grid container direction="column" spacing={2}>
            <Grid item>
              <ButtonGroup>
                <Button
                  variant={
                    displayedUtils === UTILS_FILES.USER
                      ? 'outlined'
                      : 'contained'
                  }
                  color="primary"
                  onClick={() => {
                    this.setState({ displayedUtils: UTILS_FILES.USER });
                  }}
                >
                  {t('User')}
                </Button>
                <Button
                  variant={
                    displayedUtils === UTILS_FILES.GRAASP
                      ? 'outlined'
                      : 'contained'
                  }
                  color="primary"
                  onClick={() => {
                    this.setState({ displayedUtils: UTILS_FILES.GRAASP });
                  }}
                >
                  Graasp
                </Button>
              </ButtonGroup>
            </Grid>
            {displayedUtils === UTILS_FILES.USER ? (
              <Grid item>
                <PythonEditor
                  code={userUtils}
                  onCodeChange={this.handleUserCodeOnChange}
                  onSave={this.handleSave}
                />
              </Grid>
            ) : (
              [
                <Grid item key="alert">
                  <Alert severity="info">
                    {t(
                      'This file cannot be modified. Use the user file to write your own functions.',
                    )}
                  </Alert>
                </Grid>,
                <Grid item key="editor">
                  <PythonEditor code={graaspUtils} readOnly />
                </Grid>,
              ]
            )}
            <Grid item className={classes.saveButton}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<SaveIcon />}
                onClick={this.handleSave}
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
  userUtils: algorithms.getIn(['utils', 'user']),
  graaspUtils: algorithms.getIn(['utils', 'graasp']),
  activity: Boolean(algorithms.getIn(['utils', 'activity']).size),
});

const mapDispatchToProps = {
  dispatchGetUtils: getUtils,
  dispatchSaveUtils: saveUtils,
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
