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
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
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

const styles = (theme) => ({
  buttons: {
    marginTop: theme.spacing(2),
  },
});

const OPTION_FILE = 'OPTION_FILE';
const OPTION_EDITOR = 'OPTION_EDITOR';

class AddAlgorithm extends Component {
  state = {
    name: '',
    description: '',
    author: '',
    fileLocation: '',
    code: PYTHON_TEMPLATE_CODE,
    option: OPTION_FILE,
  };

  static propTypes = {
    history: PropTypes.shape({
      goBack: PropTypes.func.isRequired,
    }).isRequired,
    dispatchAddAlgorithm: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
    classes: PropTypes.shape({
      buttons: PropTypes.string.isRequired,
    }).isRequired,
  };

  handleNameOnChange = (event) => {
    this.setState({ name: event.target.value });
  };

  handleDescriptionOnChange = (event) => {
    this.setState({ description: event.target.value });
  };

  handleAuthorOnChange = (event) => {
    this.setState({ author: event.target.value });
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

  handleBack = () => {
    const {
      history: { goBack },
    } = this.props;
    goBack();
  };

  handleSave = () => {
    const { dispatchAddAlgorithm } = this.props;
    const {
      name,
      description,
      author,
      fileLocation,
      code,
      option,
    } = this.state;
    const payload =
      option === OPTION_FILE
        ? { name, description, author, fileLocation }
        : { name, description, author, code };
    if (name) {
      dispatchAddAlgorithm(payload);
    }
  };

  render() {
    const { t, classes } = this.props;
    const {
      name,
      description,
      author,
      option,
      fileLocation,
      code,
    } = this.state;

    return (
      <Main>
        <Container>
          <h1>{t('Add algorithm')}</h1>
          <Grid container spacing={5}>
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
            <Grid item xs={7}>
              <FormControl component="fieldset">
                <RadioGroup
                  aria-label="add option"
                  name="add option"
                  value={option}
                  onChange={this.handleOptionOnChange}
                >
                  <FormControlLabel
                    value={OPTION_FILE}
                    control={<Radio color="primary" />}
                    label={t('Load algorithm from a file')}
                  />
                  <FormControlLabel
                    value={OPTION_EDITOR}
                    control={<Radio color="primary" />}
                    label={t('Write algorithm')}
                  />
                </RadioGroup>
              </FormControl>
              {option === OPTION_FILE ? (
                <Grid container alignItems="center">
                  <Grid item xs={8}>
                    <TextField
                      margin="dense"
                      label={t('Select algorithm')}
                      onChange={this.handleLocationInput}
                      value={fileLocation}
                      helperText={t('(Required)')}
                      required
                      fullWidth
                    />
                  </Grid>
                  <Grid item>
                    <BrowseFileButton
                      options={{
                        filters: [{ name: 'python', extensions: ['py'] }],
                      }}
                      onBrowseFileCallback={this.handleBrowseFileCallback}
                    />
                  </Grid>
                </Grid>
              ) : (
                <Editor
                  programmingLanguage="python"
                  code={code}
                  onCodeChange={this.handleCodeOnChange}
                />
              )}
            </Grid>
          </Grid>
          <Grid
            container
            spacing={2}
            justify="center"
            className={classes.buttons}
          >
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                startIcon={<ArrowBackIcon />}
                onClick={this.handleBack}
              >
                {t('Back')}
              </Button>
            </Grid>
            <Grid item>
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
      </Main>
    );
  }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = {
  dispatchAddAlgorithm: addAlgorithm,
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
