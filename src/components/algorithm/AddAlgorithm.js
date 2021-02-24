import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Select from '@material-ui/core/Select';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import SaveIcon from '@material-ui/icons/Save';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import {
  addAlgorithm,
  addBuiltInAlgorithm,
  clearAlgorithm,
  getAlgorithmCode,
} from '../../actions';
import { ADD_OPTIONS, FILE_FILTERS } from '../../config/constants';
import {
  ADD_ALGORITHM_BACK_BUTTON_ID,
  ADD_ALGORITHM_DESCRIPTION_ID,
  ADD_ALGORITHM_FILE_LOCATION_ID,
  ADD_ALGORITHM_FROM_EDITOR_OPTION_ID,
  ADD_ALGORITHM_FROM_FILE_OPTION_ID,
  ADD_ALGORITHM_NAME_ID,
  ADD_ALGORITHM_SAVE_BUTTON_ID,
  ADD_ALGORITHM_BUILT_IN_OPTION_ID,
} from '../../config/selectors';
import { AUTHORS } from '../../shared/constants';
import { areParametersValid } from '../../utils/parameter';
import BackButton from '../common/BackButton';
import BrowseFileButton from '../common/BrowseFileButton';
import PythonEditor from '../common/editor/PythonEditor';
import Main from '../common/Main';
import EditParametersForm from '../parameter/EditParametersForm';
import PYTHON_TEMPLATE_CODE from './pythonTemplateCode';
import GRAASP_ALGORITHMS from '../../shared/graaspAlgorithms';

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
    builtInAlgoId: '',
  };

  static propTypes = {
    dispatchAddAlgorithm: PropTypes.func.isRequired,
    dispatchAddBuiltInAlgorithm: PropTypes.func.isRequired,
    dispatchGetAlgorithmCode: PropTypes.func.isRequired,
    dispatchClearAlgorithm: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
    classes: PropTypes.shape({
      saveButton: PropTypes.string.isRequired,
      backButton: PropTypes.string.isRequired,
    }).isRequired,
    history: PropTypes.shape({
      goBack: PropTypes.func.isRequired,
    }).isRequired,
    builtInAlgoCode: PropTypes.string.isRequired,
  };

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

  handleBuiltInAlgoOnChange = ({ target: { value } }) => {
    const algorithm = GRAASP_ALGORITHMS.find(({ id }) => id === value);
    if (algorithm) {
      const { name, description, parameters, filename } = algorithm;
      this.setState({ name, description, builtInAlgoId: value, parameters });
      const { dispatchGetAlgorithmCode } = this.props;
      dispatchGetAlgorithmCode({ filename, isGraasp: true });
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
      dispatchAddBuiltInAlgorithm,
      history: { goBack },
    } = this.props;
    const {
      name,
      description,
      fileLocation,
      code,
      option,
      parameters,
      builtInAlgoId,
    } = this.state;
    const onSuccess = goBack;

    if (option === ADD_OPTIONS.BUILT_IN) {
      if (builtInAlgoId) {
        dispatchAddBuiltInAlgorithm({ id: builtInAlgoId }, onSuccess);
      }
    } else {
      const author = AUTHORS.USER;
      const payload =
        option === ADD_OPTIONS.FILE
          ? { name, description, author, parameters, fileLocation }
          : { name, description, author, parameters, code };

      dispatchAddAlgorithm(payload, onSuccess);
    }
  };

  render() {
    const { t, classes, builtInAlgoCode } = this.props;
    const {
      name,
      description,
      option,
      fileLocation,
      code,
      parameters,
      builtInAlgoId,
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
            <Grid item xs={7}>
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
                    value={ADD_OPTIONS.BUILT_IN}
                    control={<Radio color="primary" />}
                    label={t('Add built-in algorithm')}
                    id={ADD_ALGORITHM_BUILT_IN_OPTION_ID}
                  />
                  <FormControlLabel
                    value={ADD_OPTIONS.EDITOR}
                    control={<Radio color="primary" />}
                    label={t('Write algorithm')}
                    id={ADD_ALGORITHM_FROM_EDITOR_OPTION_ID}
                  />
                </RadioGroup>
              </FormControl>
              {
                // eslint-disable-next-line no-nested-ternary
                option === ADD_OPTIONS.FILE ? (
                  <Grid container alignItems="center">
                    <Grid item xs={5}>
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
                ) : option === ADD_OPTIONS.EDITOR ? (
                  <PythonEditor
                    parameters={parameters}
                    code={code}
                    onCodeChange={this.handleCodeOnChange}
                    onSave={() => isValid && this.handleSave()}
                  />
                ) : (
                  <Grid container spacing={2}>
                    <Grid item xs={5}>
                      <FormControl fullWidth>
                        <InputLabel id="built-in-algorithm-select-label">
                          {t('Algorithm')}
                        </InputLabel>
                        <Select
                          labelId="built-in-algorithm-select-label"
                          value={builtInAlgoId}
                          onChange={this.handleBuiltInAlgoOnChange}
                        >
                          {GRAASP_ALGORITHMS.map(({ id, name: algoName }) => (
                            <MenuItem value={id} key={id}>
                              {algoName}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    {builtInAlgoId && (
                      <Grid item xs={12}>
                        <PythonEditor
                          parameters={parameters}
                          code={builtInAlgoCode}
                          readOnly
                        />
                      </Grid>
                    )}
                  </Grid>
                )
              }
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
                disabled={option === ADD_OPTIONS.BUILT_IN}
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
                disabled={option === ADD_OPTIONS.BUILT_IN}
              />
              <EditParametersForm
                parameters={parameters}
                onChange={this.handleParamsOnChange}
                disabled={option === ADD_OPTIONS.BUILT_IN}
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

const mapStateToProps = ({ algorithms }) => ({
  builtInAlgoCode: algorithms.getIn(['current', 'content', 'code']) || '',
});

const mapDispatchToProps = {
  dispatchAddAlgorithm: addAlgorithm,
  dispatchAddBuiltInAlgorithm: addBuiltInAlgorithm,
  dispatchClearAlgorithm: clearAlgorithm,
  dispatchGetAlgorithmCode: getAlgorithmCode,
};

const ConnectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps,
)(AddAlgorithm);

const StyledComponent = withStyles(styles, { withTheme: true })(
  ConnectedComponent,
);

const TranslatedComponent = withTranslation()(StyledComponent);

export default withRouter(TranslatedComponent);
