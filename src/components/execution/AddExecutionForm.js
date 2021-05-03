import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import ListSubheader from '@material-ui/core/ListSubheader';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import Alert from '@material-ui/lab/Alert';
import { List } from 'immutable';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import {
  createExecution,
  getAlgorithms,
  getDatasets,
  getResults,
  getPipelines,
  executePipeline,
} from '../../actions';
import {
  buildExecutionAlgorithmOptionId,
  buildExecutionDatasetOptionId,
  buildExecutionPipelineOptionId,
  EXECUTIONS_ALERT_NO_DATASET_ID,
  EXECUTIONS_ALGORITHMS_SELECT_ID,
  EXECUTIONS_DATASETS_SELECT_ID,
  EXECUTIONS_EXECUTE_BUTTON_ID,
  EXECUTION_FORM_NAME_INPUT_ID,
} from '../../config/selectors';
import { ALGORITHM_TYPES, GRAASP_SCHEMA_ID } from '../../shared/constants';
import {
  buildPythonWrongVersionMessage,
  ERROR_PYTHON_NOT_INSTALLED_MESSAGE,
} from '../../shared/messages';
import { areParametersValid } from '../../utils/parameter';
import Loader from '../common/Loader';
import SchemaTags from '../common/SchemaTags';
import SetParametersFormButton from '../parameter/SetParametersFormButton';

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
  parametersButton: {
    margin: theme.spacing(1),
  },
});

class AddExecutionForm extends Component {
  static propTypes = {
    results: PropTypes.instanceOf(List),
    datasets: PropTypes.instanceOf(List),
    algorithms: PropTypes.instanceOf(List),
    pipelines: PropTypes.instanceOf(List),
    t: PropTypes.func.isRequired,
    dispatchGetDatasets: PropTypes.func.isRequired,
    dispatchGetAlgorithms: PropTypes.func.isRequired,
    dispatchCreateExecution: PropTypes.func.isRequired,
    dispatchGetResults: PropTypes.func.isRequired,
    dispatchGetPipelines: PropTypes.func.isRequired,
    dispatchExecutePipeline: PropTypes.func.isRequired,
    classes: PropTypes.shape({
      wrapper: PropTypes.string.isRequired,
      formControl: PropTypes.string.isRequired,
      infoAlert: PropTypes.string.isRequired,
      buttonContainer: PropTypes.string.isRequired,
      buttonWrapper: PropTypes.string.isRequired,
      menuItem: PropTypes.string.isRequired,
      schemaTag: PropTypes.string.isRequired,
      parametersButton: PropTypes.string.isRequired,
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
    pipelines: null,
  };

  state = {
    sourceId: '',
    algorithmId: '',
    pipelineId: '',
    userProvidedFilename: '',
    parameters: [],
    schemaId: GRAASP_SCHEMA_ID,
  };

  componentDidMount() {
    const {
      dispatchGetDatasets,
      dispatchGetAlgorithms,
      dispatchGetResults,
      dispatchGetPipelines,
    } = this.props;
    dispatchGetDatasets();
    dispatchGetAlgorithms();
    dispatchGetResults();
    dispatchGetPipelines();
  }

  handleSourceSelectOnChange = (e) => {
    const { datasets, algorithms } = this.props;
    const { algorithmId } = this.state;
    let { schemaId } = this.state;
    const sourceId = e.target.value;
    this.setState({ sourceId });

    // if current schemaId not in newly selected dataset, then set it as the first one of the dataset
    const schemaIds = datasets.find(({ id }) => id === sourceId)?.schemaIds;
    if (schemaIds?.length && !schemaIds?.includes(schemaId)) {
      [schemaId] = schemaIds;
      this.setState({
        schemaId,
        parameters:
          algorithms.find(({ id }) => id === algorithmId)?.parameters || [],
      });
    }
  };

  handleAlgorithmSelectOnChange = (e) => {
    const { algorithms, pipelines } = this.props;
    const targetId = e.target.value;
    if (pipelines.find(({ id }) => id === targetId)) {
      this.setState({
        pipelineId: targetId,
        algorithmId: '',
        parameters: [],
      });
    } else {
      this.setState({
        algorithmId: targetId,
        pipelineId: '',
        parameters:
          algorithms.find(({ id }) => id === targetId)?.parameters || [],
      });
    }
  };

  handleNameOnChange = (e) => {
    this.setState({ userProvidedFilename: e.target.value });
  };

  executeAlgorithm = () => {
    const { dispatchCreateExecution } = this.props;
    const {
      sourceId,
      algorithmId,
      userProvidedFilename,
      parameters,
      schemaId,
    } = this.state;
    dispatchCreateExecution({
      sourceId,
      algorithmId,
      userProvidedFilename,
      parameters,
      schemaId,
    });
    this.setState({ userProvidedFilename: '' });
  };

  executePipeline = () => {
    const { pipelines, dispatchExecutePipeline } = this.props;
    const { sourceId, userProvidedFilename, schemaId, pipelineId } = this.state;

    dispatchExecutePipeline({
      pipeline: pipelines.find(({ id }) => id === pipelineId),
      sourceId,
      userProvidedFilename,
      schemaId,
    });

    this.setState({ userProvidedFilename: '' });
  };

  renderDatasetsAndResultsSelect = () => {
    const { sourceId } = this.state;
    const { classes, t, datasets, results } = this.props;
    const datasetMenuItems = datasets
      .sortBy(({ name }) => name)
      .map(({ id, name, schemaIds }) => (
        <MenuItem
          value={id}
          key={id}
          className={classes.menuItem}
          id={buildExecutionDatasetOptionId(id)}
        >
          <Grid container alignItems="center" spacing={1}>
            <Grid item>{name}</Grid>
            <SchemaTags schemaIds={schemaIds} showTooltip={false} />
          </Grid>
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

  renderAlgorithmsAndPipelinesSelect = () => {
    const { algorithmId, pipelineId } = this.state;
    const { classes, t, algorithms, pipelines } = this.props;
    const algorithmMenuItems = algorithms.map(({ id, name }) => (
      <MenuItem
        value={id}
        key={id}
        className={classes.menuItem}
        id={buildExecutionAlgorithmOptionId(id)}
      >
        {name}
      </MenuItem>
    ));

    const pipelineMenuItems = pipelines.map(({ id, name }) => (
      <MenuItem
        value={id}
        key={id}
        className={classes.menuItem}
        id={buildExecutionPipelineOptionId(id)}
      >
        {name}
      </MenuItem>
    ));

    const algorithmLabel = `${t('Algorithm')} ${t('(Required)')}`;

    return (
      <FormControl variant="outlined" className={classes.formControl}>
        <InputLabel id="algorithm-select">{algorithmLabel}</InputLabel>
        <Select
          labelId="algorithm-select"
          value={pipelineId !== '' ? pipelineId : algorithmId}
          onChange={this.handleAlgorithmSelectOnChange}
          label={algorithmLabel}
          id={EXECUTIONS_ALGORITHMS_SELECT_ID}
        >
          {!algorithmMenuItems.isEmpty() && (
            <ListSubheader>{t('Algorithms')}</ListSubheader>
          )}
          {algorithmMenuItems}
          {!pipelineMenuItems.isEmpty() && (
            <ListSubheader>{t('Pipelines')}</ListSubheader>
          )}
          {pipelineMenuItems}
        </Select>
      </FormControl>
    );
  };

  renderExecuteButton = () => {
    const { sourceId, algorithmId, parameters, pipelineId } = this.state;
    const { t, pythonVersion, classes, pipelines } = this.props;

    const validAlgorithm =
      sourceId &&
      algorithmId &&
      pythonVersion?.valid &&
      (!parameters || areParametersValid(parameters));

    const validPipeline = sourceId && pipelines && pipelineId;
    const button = (
      <div className={classes.buttonWrapper}>
        <Button
          id={EXECUTIONS_EXECUTE_BUTTON_ID}
          variant="contained"
          color="primary"
          onClick={pipelineId ? this.executePipeline : this.executeAlgorithm}
          disabled={!(validPipeline || validAlgorithm)}
        >
          {t('Execute')}
        </Button>
      </div>
    );

    let tooltip;
    if (!pythonVersion?.version) {
      tooltip = t(ERROR_PYTHON_NOT_INSTALLED_MESSAGE);
    } else if (!pythonVersion?.valid) {
      tooltip = t(buildPythonWrongVersionMessage(pythonVersion.version));
    }

    if (tooltip) {
      return (
        <div className={classes.buttonContainer}>
          <Tooltip title={tooltip}>{button}</Tooltip>
        </div>
      );
    }

    return <div className={classes.buttonContainer}>{button}</div>;
  };

  handleParametersOnChange = (parameters) => {
    this.setState({ parameters });
  };

  handleSchemaOnChange = (schemaId) => {
    this.setState({ schemaId });
  };

  render() {
    const { algorithms, datasets, classes, t, isLoading, results } = this.props;
    const { userProvidedFilename, parameters, schemaId } = this.state;

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
          {t('No algorithms available')}
        </Alert>
      );
    }

    return (
      <div className={classes.wrapper}>
        {this.renderDatasetsAndResultsSelect()}
        {this.renderAlgorithmsAndPipelinesSelect()}
        <FormControl variant="outlined" className={classes.formControl}>
          <TextField
            onChange={this.handleNameOnChange}
            label={t('Save As...')}
            variant="outlined"
            value={userProvidedFilename}
            id={EXECUTION_FORM_NAME_INPUT_ID}
          />
        </FormControl>
        {parameters.length > 0 && (
          <SetParametersFormButton
            className={classes.parametersButton}
            parameters={parameters}
            schemaId={schemaId}
            parametersOnChange={this.handleParametersOnChange}
            schemaOnChange={this.handleSchemaOnChange}
          />
        )}
        {this.renderExecuteButton()}
      </div>
    );
  }
}

const mapStateToProps = ({
  dataset,
  algorithms,
  settings,
  result,
  schema,
  pipeline,
}) => ({
  datasets: dataset.get('datasets'),
  results: result.get('results'),
  algorithms: algorithms
    .get('algorithms')
    .filter(({ type }) => type === ALGORITHM_TYPES.ANONYMIZATION),
  pythonVersion: settings.get('pythonVersion'),
  isLoading: Boolean(
    dataset.getIn(['activity']).size &&
      algorithms.getIn(['activity']).size &&
      result.getIn(['activity']).size,
  ),
  pipelines: pipeline.get('pipelines'),
});

const mapDispatchToProps = {
  dispatchGetDatasets: getDatasets,
  dispatchGetAlgorithms: getAlgorithms,
  dispatchCreateExecution: createExecution,
  dispatchExecutePipeline: executePipeline,
  dispatchGetResults: getResults,
  dispatchGetPipelines: getPipelines,
};

const ConnectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps,
)(AddExecutionForm);

const StyledComponent = withStyles(styles, { withTheme: true })(
  ConnectedComponent,
);

export default withTranslation()(StyledComponent);
