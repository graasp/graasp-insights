import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import SaveIcon from '@material-ui/icons/Save';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { addAlgorithm } from '../../actions';
import { ADD_OPTIONS, FILE_FILTERS } from '../../config/constants';
import {
  ADD_ALGORITHM_BACK_BUTTON_ID,
  ADD_ALGORITHM_DESCRIPTION_ID,
  ADD_ALGORITHM_FILE_LOCATION_ID,
  ADD_ALGORITHM_FROM_EDITOR_OPTION_ID,
  ADD_ALGORITHM_FROM_FILE_OPTION_ID,
  ADD_ALGORITHM_NAME_ID,
  ADD_ALGORITHM_SAVE_BUTTON_ID,
} from '../../config/selectors';
import { AUTHORS } from '../../shared/constants';
import { areParametersValid } from '../../utils/parameter';
import BackButton from '../common/BackButton';
import BrowseFileButton from '../common/BrowseFileButton';
import PythonEditor from '../common/editor/PythonEditor';
import Main from '../common/Main';
import EditParametersForm from '../parameter/EditParametersForm';
import PYTHON_TEMPLATE_CODE from './pythonTemplateCode';

const styles = (theme) => ({
  saveButton: {
    margin: theme.spacing(2, 0),
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
    parameters: [],
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

  handleParamsOnChange = (parameters) => {
    this.setState({ parameters });
  };

  handleSave = () => {
    const {
      dispatchAddAlgorithm,
      history: { goBack },
    } = this.props;
    const {
      name,
      description,
      fileLocation,
      code,
      option,
      parameters,
    } = this.state;
    const author = AUTHORS.USER;
    const payload =
      option === ADD_OPTIONS.FILE
        ? { name, description, author, parameters, fileLocation }
        : { name, description, author, parameters, code };

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
      parameters,
    } = this.state;

    const isValid =
      name &&
      (option !== ADD_OPTIONS.FILE || fileLocation) &&
      areParametersValid(parameters);

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
                <PythonEditor
                  parameters={parameters}
                  code={code}
                  onCodeChange={this.handleCodeOnChange}
                  onSave={() => isValid && this.handleSave()}
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
              <EditParametersForm
                parameters={parameters}
                onChange={this.handleParamsOnChange}
              />
            </Grid>
          </Grid>
          <div className={classes.saveButton}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<SaveIcon />}
              onClick={this.handleSave}
              id={ADD_ALGORITHM_SAVE_BUTTON_ID}
              disabled={!isValid}
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
