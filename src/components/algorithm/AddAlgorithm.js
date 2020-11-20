import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { withTranslation } from 'react-i18next';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';

import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';

import Main from '../common/Main';
import BrowseFileButton from '../common/BrowseFileButton';
import Editor from '../common/Editor';
import { addAlgorithm } from '../../actions';
import PYTHON_TEMPLATE_CODE from './pythonTemplateCode';
import {
  FILE_FILTERS,
  EDITOR_PROGRAMMING_LANGUAGES,
  ADD_OPTIONS,
} from '../../config/constants';
import { AUTHOR_USER } from '../../shared/constants';
import BackButton from '../common/BackButton';
import {
  ADD_ALGORITHM_NAME_ID,
  ADD_ALGORITHM_DESCRIPTION_ID,
  ADD_ALGORITHM_FILE_LOCATION_ID,
  ADD_ALGORITHM_SAVE_BUTTON_ID,
  ADD_ALGORITHM_BACK_BUTTON_ID,
  ADD_ALGORITHM_FROM_FILE_OPTION_ID,
  ADD_ALGORITHM_FROM_EDITOR_OPTION_ID,
} from '../../config/selectors';

const styles = (theme) => ({
  saveButton: {
    marginTop: theme.spacing(2),
    textAlign: 'center',
  },
  backButton: {
    position: 'fixed',
    right: theme.spacing(2),
    bottom: theme.spacing(2),
  },
});

class AddAlgorithm extends Component {
  state = {
    name: '',
    description: '',
    fileLocation: '',
    code: PYTHON_TEMPLATE_CODE,
    option: ADD_OPTIONS.FILE,
    programmingLanguage: EDITOR_PROGRAMMING_LANGUAGES.PYTHON,
  };

  static propTypes = {
    dispatchAddAlgorithm: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
    classes: PropTypes.shape({
      saveButton: PropTypes.string.isRequired,
      backButton: PropTypes.string.isRequired,
    }).isRequired,
    history: PropTypes.shape({
      goBack: PropTypes.func.isRequired,
    }).isRequired,
  };

  handleNameOnChange = (event) => {
    this.setState({ name: event.target.value });
  };

  handleDescriptionOnChange = (event) => {
    this.setState({ description: event.target.value });
  };

  handleLocationInput = (event) => {
    this.setState({ fileLocation: event.target.value });
  };

  handleBrowseFileCallback = (filePaths) => {
    // currently we select only one file
    const filePath = filePaths[0];
    if (filePath) {
      this.setState({ fileLocation: filePath });
    }
  };

  handleCodeOnChange = (code) => {
    this.setState({ code });
  };

  handleOptionOnChange = (event) => {
    this.setState({ option: event.target.value });
  };

  handleSave = () => {
    const {
      dispatchAddAlgorithm,
      history: { goBack },
    } = this.props;
    const { name, description, fileLocation, code, option } = this.state;
    const author = AUTHOR_USER;
    const payload =
      option === ADD_OPTIONS.FILE
        ? { name, description, author, fileLocation }
        : { name, description, author, code };

    const onSuccess = goBack;

    dispatchAddAlgorithm({ payload, onSuccess });
  };

  render() {
    const { t, classes } = this.props;
    const {
      name,
      description,
      option,
      fileLocation,
      code,
      programmingLanguage,
    } = this.state;

    return (
      <Main>
        <Container>
          <h1>{t('Add Algorithm')}</h1>
          <Grid container spacing={5} justify="space-between">
            <Grid item xs={option === ADD_OPTIONS.FILE ? 5 : 7}>
              <FormControl component="fieldset">
                <RadioGroup
                  aria-label="add-option"
                  value={option}
                  onChange={this.handleOptionOnChange}
                >
                  <FormControlLabel
                    value={ADD_OPTIONS.FILE}
                    control={<Radio color="primary" />}
                    label={t('Load algorithm from a file')}
                    id={ADD_ALGORITHM_FROM_FILE_OPTION_ID}
                  />
                  <FormControlLabel
                    value={ADD_OPTIONS.EDITOR}
                    control={<Radio color="primary" />}
                    label={t('Write algorithm')}
                    id={ADD_ALGORITHM_FROM_EDITOR_OPTION_ID}
                  />
                </RadioGroup>
              </FormControl>
              {option === ADD_OPTIONS.FILE ? (
                <Grid container alignItems="center">
                  <Grid item xs={11}>
                    <TextField
                      margin="dense"
                      label={t('Select algorithm')}
                      onChange={this.handleLocationInput}
                      value={fileLocation}
                      helperText={t('(Required)')}
                      required
                      fullWidth
                      id={ADD_ALGORITHM_FILE_LOCATION_ID}
                    />
                  </Grid>
                  <Grid item xs={1}>
                    <BrowseFileButton
                      filters={[FILE_FILTERS.PYTHON, FILE_FILTERS.ALL]}
                      onBrowseFileCallback={this.handleBrowseFileCallback}
                    />
                  </Grid>
                </Grid>
              ) : (
                <Editor
                  programmingLanguage={programmingLanguage}
                  code={code}
                  onCodeChange={this.handleCodeOnChange}
                  onSave={this.handleSave}
                />
              )}
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
                id={ADD_ALGORITHM_NAME_ID}
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
                id={ADD_ALGORITHM_DESCRIPTION_ID}
              />
            </Grid>
          </Grid>
          <div className={classes.saveButton}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<SaveIcon />}
              onClick={this.handleSave}
              disabled={!name || (option === ADD_OPTIONS.FILE && !fileLocation)}
              id={ADD_ALGORITHM_SAVE_BUTTON_ID}
            >
              {t('Save')}
            </Button>
          </div>
        </Container>
        <BackButton
          className={classes.backButton}
          id={ADD_ALGORITHM_BACK_BUTTON_ID}
        />
      </Main>
    );
  }
}

const mapDispatchToProps = {
  dispatchAddAlgorithm: addAlgorithm,
};

const ConnectedComponent = connect(null, mapDispatchToProps)(AddAlgorithm);

const StyledComponent = withStyles(styles, { withTheme: true })(
  ConnectedComponent,
);

const TranslatedComponent = withTranslation()(StyledComponent);

export default withRouter(TranslatedComponent);
