import React, { Component } from 'react';
import { connect } from 'react-redux';
import { List } from 'immutable';
import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { withTranslation } from 'react-i18next';
import MenuItem from '@material-ui/core/MenuItem';
import ListSubheader from '@material-ui/core/ListSubheader';
import Alert from '@material-ui/lab/Alert';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import Loader from '../common/Loader';
import {
  getDatasets,
  getAlgorithms,
  getResults,
  createExecution,
} from '../../actions';
import {
  ERROR_PYTHON_NOT_INSTALLED_MESSAGE,
  buildPythonWrongVersionMessage,
} from '../../shared/messages';
import { SCHEMA_TYPES } from '../../shared/constants';
import SchemaTag from '../common/SchemaTag';
import {
  buildExecutionAlgorithmOptionId,
  buildExecutionDatasetOptionId,
  EXECUTIONS_ALERT_NO_DATASET_ID,
  EXECUTIONS_ALGORITHMS_SELECT_ID,
  EXECUTIONS_DATASETS_SELECT_ID,
  EXECUTIONS_EXECUTE_BUTTON_ID,
  EXECUTION_FORM_NAME_INPUT_ID,
} from '../../config/selectors';

const styles = (theme) => ({
  wrapper: {
    width: '50%',
    margin: theme.spacing(2, 'auto', 0),
  },
  formControl: {
    margin: theme.spacing(1),
    width: '100%',
  },
  infoAlert: {
    margin: theme.spacing(2),
  },
  buttonContainer: {
    textAlign: 'center',
    marginTop: theme.spacing(2),
  },
  buttonWrapper: {
    display: 'inline-block',
  },
  menuItem: {
    padding: theme.spacing(0.5, 4),
  },
  schemaTag: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
  },
});

class AddExecutionForm extends Component {
  static propTypes = {
    results: PropTypes.instanceOf(List),
    datasets: PropTypes.instanceOf(List),
    algorithms: PropTypes.instanceOf(List),
    t: PropTypes.func.isRequired,
    dispatchGetDatasets: PropTypes.func.isRequired,
    dispatchGetAlgorithms: PropTypes.func.isRequired,
    dispatchCreateExecution: PropTypes.func.isRequired,
    dispatchGetResults: PropTypes.func.isRequired,
    classes: PropTypes.shape({
      wrapper: PropTypes.string.isRequired,
      formControl: PropTypes.string.isRequired,
      infoAlert: PropTypes.string.isRequired,
      buttonContainer: PropTypes.string.isRequired,
      buttonWrapper: PropTypes.string.isRequired,
      menuItem: PropTypes.string.isRequired,
      schemaTag: PropTypes.string.isRequired,
    }).isRequired,
    isLoading: PropTypes.bool.isRequired,
    pythonVersion: PropTypes.shape({
      valid: PropTypes.bool,
      version: PropTypes.string,
    }).isRequired,
  };

  static defaultProps = {
    datasets: null,
    algorithms: null,
    results: null,
  };

  state = {
    sourceId: '',
    algorithmId: '',
    userProvidedFilename: '',
  };

  componentDidMount() {
    const {
      dispatchGetDatasets,
      dispatchGetAlgorithms,
      dispatchGetResults,
    } = this.props;
    dispatchGetDatasets();
    dispatchGetAlgorithms();
    dispatchGetResults();
  }

  handleSourceSelectOnChange = (e) => {
    this.setState({ sourceId: e.target.value });
  };

  handleAlgorithmSelectOnChange = (e) => {
    this.setState({ algorithmId: e.target.value });
  };

  handleNameOnChange = (e) => {
    this.setState({ userProvidedFilename: e.target.value });
  };

  executeAlgorithm = () => {
    const { dispatchCreateExecution } = this.props;
    const { sourceId, algorithmId, userProvidedFilename } = this.state;
    dispatchCreateExecution({
      sourceId,
      algorithmId,
      userProvidedFilename,
    });
    this.setState({ userProvidedFilename: '' });
  };

  renderDatasetsAndResultsSelect = () => {
    const { sourceId } = this.state;
    const { classes, t, datasets, results } = this.props;

    const datasetMenuItems = datasets
      .sortBy(({ name }) => name)
      .map(({ id, name, schemaType }) => (
        <MenuItem
          value={id}
          key={id}
          className={classes.menuItem}
          id={buildExecutionDatasetOptionId(id)}
        >
          {name}
          {schemaType && schemaType !== SCHEMA_TYPES.NONE && (
            <SchemaTag schemaType={schemaType} className={classes.schemaTag} />
          )}
        </MenuItem>
      ));

    const resultMenuItems = results
      .sortBy(({ name }) => name)
      .map(({ id, name }) => (
        <MenuItem
          value={id}
          key={id}
          className={classes.menuItem}
          id={buildExecutionDatasetOptionId(id)}
        >
          {name}
        </MenuItem>
      ));

    const label = `${t('Dataset')} ${t('(Required)')}`;

    return (
      <FormControl variant="outlined" className={classes.formControl}>
        <InputLabel id="dataset-select">{label}</InputLabel>
        <Select
          labelId="dataset-select"
          value={sourceId}
          onChange={this.handleSourceSelectOnChange}
          label={label}
          id={EXECUTIONS_DATASETS_SELECT_ID}
        >
          {!datasetMenuItems.isEmpty() && (
            <ListSubheader>{t('Datasets')}</ListSubheader>
          )}
          {datasetMenuItems}
          {!resultMenuItems.isEmpty() && (
            <ListSubheader>{t('Results')}</ListSubheader>
          )}
          {resultMenuItems}
        </Select>
      </FormControl>
    );
  };

  renderExecuteButton = () => {
    const { sourceId, algorithmId } = this.state;
    const { t, pythonVersion, classes } = this.props;
    const button = (
      <div className={classes.buttonWrapper}>
        <Button
          id={EXECUTIONS_EXECUTE_BUTTON_ID}
          variant="contained"
          color="primary"
          onClick={this.executeAlgorithm}
          disabled={!sourceId || !algorithmId || !pythonVersion?.valid}
        >
          {t('Execute')}
        </Button>
      </div>
    );

    if (!pythonVersion?.version) {
      return (
        <div className={classes.buttonContainer}>
          <Tooltip title={t(ERROR_PYTHON_NOT_INSTALLED_MESSAGE)}>
            {button}
          </Tooltip>
        </div>
      );
    }

    if (!pythonVersion.valid) {
      return (
        <div className={classes.buttonContainer}>
          <Tooltip
            title={t(buildPythonWrongVersionMessage(pythonVersion.version))}
          >
            {button}
          </Tooltip>
        </div>
      );
    }

    return <div className={classes.buttonContainer}>{button}</div>;
  };

  render() {
    const { algorithms, datasets, classes, t, isLoading, results } = this.props;
    const { algorithmId, userProvidedFilename } = this.state;

    if (isLoading) {
      return <Loader />;
    }

    if (datasets.isEmpty() && results.isEmpty()) {
      return (
        <Alert
          severity="info"
          className={classes.infoAlert}
          id={EXECUTIONS_ALERT_NO_DATASET_ID}
        >
          {t('Load a dataset first')}
        </Alert>
      );
    }

    if (!algorithms.size) {
      return (
        <Alert severity="info" className={classes.infoAlert}>
          {t('No algorithms are available')}
        </Alert>
      );
    }

    const algorithmLabel = `${t('Algorithm')} ${t('(Required)')}`;

    return (
      <div className={classes.wrapper}>
        {this.renderDatasetsAndResultsSelect()}
        <FormControl variant="outlined" className={classes.formControl}>
          <InputLabel>{algorithmLabel}</InputLabel>
          <Select
            labelId="algorithm-select"
            value={algorithmId}
            onChange={this.handleAlgorithmSelectOnChange}
            label={algorithmLabel}
            id={EXECUTIONS_ALGORITHMS_SELECT_ID}
          >
            {algorithms.map(({ id, name }) => (
              <MenuItem
                value={id}
                key={id}
                id={buildExecutionAlgorithmOptionId(id)}
              >
                {name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl variant="outlined" className={classes.formControl}>
          <TextField
            onChange={this.handleNameOnChange}
            label={t('Save As...')}
            variant="outlined"
            value={userProvidedFilename}
            id={EXECUTION_FORM_NAME_INPUT_ID}
          />
        </FormControl>

        {this.renderExecuteButton()}
      </div>
    );
  }
}

const mapStateToProps = ({ dataset, algorithms, settings, result }) => ({
  datasets: dataset.get('datasets'),
  results: result.get('results'),
  algorithms: algorithms.get('algorithms'),
  pythonVersion: settings.get('pythonVersion'),
  isLoading: Boolean(
    dataset.getIn(['activity']).size &&
      algorithms.getIn(['activity']).size &&
      result.getIn(['activity']).size,
  ),
});

const mapDispatchToProps = {
  dispatchGetDatasets: getDatasets,
  dispatchGetAlgorithms: getAlgorithms,
  dispatchCreateExecution: createExecution,
  dispatchGetResults: getResults,
};

const ConnectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps,
)(AddExecutionForm);

const StyledComponent = withStyles(styles, { withTheme: true })(
  ConnectedComponent,
);

export default withTranslation()(StyledComponent);
