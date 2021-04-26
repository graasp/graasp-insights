import React, { Component } from 'react';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import ListSubheader from '@material-ui/core/ListSubheader';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { List } from 'immutable';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import {
  createValidation,
  getDatasets,
  getResults,
  getSchemas,
} from '../../actions';
import {
  ADD_VALIDATION_ADD_ALGORITHM_BUTTON_ID,
  ADD_VALIDATION_ALGORITHMS_SELECT_ID,
  ADD_VALIDATION_DATASETS_SELECT_ID,
  ADD_VALIDATION_EXECUTE_BUTTON_ID,
  buildAddValidationAlgorithmOptionId,
  buildAddValidationDatasetOptionId,
} from '../../config/selectors';
import { ALGORITHM_TYPES, GRAASP_SCHEMA_ID } from '../../shared/constants';
import BackButton from '../common/BackButton';
import Main from '../common/Main';
import SchemaTags from '../common/SchemaTags';
import SetParametersFormButton from '../parameter/SetParametersFormButton';
import { VALIDATION_PATH } from '../../config/paths';

const styles = (theme) => ({
  backButton: {
    position: 'fixed',
    right: theme.spacing(2),
    bottom: theme.spacing(2),
  },
  algoButtons: {
    marginTop: theme.spacing(2),
  },
  menuItem: {
    padding: theme.spacing(0.5, 4),
  },
  formControl: {
    margin: theme.spacing(1),
    width: '100%',
  },
  addAlgorithmButton: {
    margin: theme.spacing(0, 2),
  },
  executeButton: {
    textAlign: 'center',
    marginTop: theme.spacing(2),
  },
});

class AddValidation extends Component {
  static propTypes = {
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
    dispatchGetDatasets: PropTypes.func.isRequired,
    dispatchGetResults: PropTypes.func.isRequired,
    dispatchGetSchemas: PropTypes.func.isRequired,
    dispatchCreateValidation: PropTypes.func.isRequired,
    datasets: PropTypes.instanceOf(List).isRequired,
    results: PropTypes.instanceOf(List).isRequired,
    validationAlgorithms: PropTypes.instanceOf(List).isRequired,
    t: PropTypes.func.isRequired,
    classes: PropTypes.shape({
      algoButtons: PropTypes.string.isRequired,
      menuItem: PropTypes.string.isRequired,
      formControl: PropTypes.string.isRequired,
      addAlgorithmButton: PropTypes.string.isRequired,
      backButton: PropTypes.string.isRequired,
      executeButton: PropTypes.string.isRequired,
    }).isRequired,
  };

  state = {
    sourceId: '',
    algorithmId: '',
    selectedValidationAlgorithms: [],
    schemaId: GRAASP_SCHEMA_ID,
    expandedIdx: false,
  };

  componentDidMount() {
    const {
      dispatchGetDatasets,
      dispatchGetResults,
      dispatchGetSchemas,
    } = this.props;
    dispatchGetDatasets();
    dispatchGetResults();
    dispatchGetSchemas();
  }

  handleSourceSelectOnChange = (e) => {
    const { datasets } = this.props;
    let { schemaId } = this.state;
    const sourceId = e.target.value;
    this.setState({ sourceId });

    // if current schemaId not in newly selected dataset, then set it as the first one of the dataset
    const schemaIds = datasets.find(({ id }) => id === sourceId)?.schemaIds;
    if (schemaIds?.length && !schemaIds?.includes(schemaId)) {
      [schemaId] = schemaIds;
      this.setState({
        schemaId,
      });
    }
  };

  handleExpand = (idx) => (event, isExpanded) => {
    this.setState({ expandedIdx: isExpanded ? idx : false });
  };

  handleParametersOnChange = (parameters, algoIdx) => {
    const { selectedValidationAlgorithms } = this.state;
    const updatedAlgo = {
      ...selectedValidationAlgorithms[algoIdx],
      parameters,
    };

    const updatedAlgorithms = selectedValidationAlgorithms.slice();
    updatedAlgorithms.splice(algoIdx, 1, updatedAlgo);
    this.setState({ selectedValidationAlgorithms: updatedAlgorithms });
  };

  handleSchemaOnChange = (schemaId) => {
    this.setState({ schemaId });
  };

  handleRemove = (idx) => {
    const { selectedValidationAlgorithms } = this.state;

    const newAlgos = selectedValidationAlgorithms.slice();
    newAlgos.splice(idx, 1);

    this.setState({
      selectedValidationAlgorithms: newAlgos,
      expandedIdx: false,
    });
  };

  handleExecute = () => {
    const {
      history: { push },
      dispatchCreateValidation,
    } = this.props;
    const { sourceId, selectedValidationAlgorithms, schemaId } = this.state;
    dispatchCreateValidation({
      sourceId,
      algorithms: selectedValidationAlgorithms,
      schemaId,
    });
    push(VALIDATION_PATH);
  };

  handleAddAlgorithm = () => {
    const { validationAlgorithms } = this.props;
    const { algorithmId, selectedValidationAlgorithms } = this.state;
    const selectedAlgo = validationAlgorithms.find(
      ({ id }) => id === algorithmId,
    );
    if (selectedAlgo) {
      const newSelectedAlgos = selectedValidationAlgorithms.slice();
      newSelectedAlgos.push(selectedAlgo);
      this.setState({
        selectedValidationAlgorithms: newSelectedAlgos,
        expandedIdx: newSelectedAlgos.length - 1,
        algorithmId: '',
      });
    }
  };

  handleAlgorithmSelectOnChange = (e) => {
    const algorithmId = e.target.value;
    this.setState({
      algorithmId,
    });
  };

  renderDatasetsAndResultsSelect = () => {
    const { sourceId } = this.state;
    const { classes, t, datasets, results } = this.props;

    const datasetMenuItems = datasets
      .sortBy(({ name }) => name)
      .map(({ id, name, schemaIds }) => (
        <MenuItem
          id={buildAddValidationDatasetOptionId(id)}
          value={id}
          key={id}
          className={classes.menuItem}
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
          id={buildAddValidationDatasetOptionId(id)}
          value={id}
          key={id}
          className={classes.menuItem}
        >
          {name}
        </MenuItem>
      ));

    const label = `${t('Dataset')} ${t('(Required)')}`;

    return (
      <FormControl variant="outlined" className={classes.formControl}>
        <InputLabel id="dataset-select">{label}</InputLabel>
        <Select
          id={ADD_VALIDATION_DATASETS_SELECT_ID}
          labelId="dataset-select"
          value={sourceId}
          onChange={this.handleSourceSelectOnChange}
          label={label}
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

  renderVerificationAlgorithmSelect = () => {
    const { validationAlgorithms, classes, t } = this.props;
    const { algorithmId } = this.state;

    const algorithmLabel = t('Validation Algorithm');

    return (
      <FormControl variant="outlined" className={classes.formControl}>
        <InputLabel>{algorithmLabel}</InputLabel>
        <Select
          id={ADD_VALIDATION_ALGORITHMS_SELECT_ID}
          value={algorithmId}
          onChange={this.handleAlgorithmSelectOnChange}
          label={algorithmLabel}
        >
          {validationAlgorithms.map(({ id, name }) => (
            <MenuItem
              id={buildAddValidationAlgorithmOptionId(id)}
              value={id}
              key={id}
            >
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  };

  renderAddValidationAlgorithmButton = () => {
    const { classes } = this.props;
    const { algorithmId } = this.state;
    return (
      <Button
        id={ADD_VALIDATION_ADD_ALGORITHM_BUTTON_ID}
        className={classes.addAlgorithmButton}
        fullWidth
        color="primary"
        aria-label="add-algorithm"
        onClick={this.handleAddAlgorithm}
        disabled={!algorithmId}
        variant="contained"
      >
        <AddIcon />
      </Button>
    );
  };

  render() {
    const { t, classes } = this.props;
    const {
      selectedValidationAlgorithms,
      expandedIdx,
      schemaId,
      sourceId,
    } = this.state;

    return (
      <Main>
        <Container>
          <h1>{t('Validate dataset')}</h1>
          <Grid container spacing={4}>
            <Grid item xs={6}>
              <Grid container alignItems="center">
                <Grid item xs={10}>
                  {this.renderDatasetsAndResultsSelect()}
                </Grid>
                <Grid item xs={10}>
                  {this.renderVerificationAlgorithmSelect()}
                </Grid>
                <Grid item xs={1}>
                  {this.renderAddValidationAlgorithmButton()}
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={6}>
              {selectedValidationAlgorithms.map(
                ({ id, name, description, parameters }, idx) => {
                  return (
                    <Accordion
                      expanded={idx === expandedIdx}
                      onChange={this.handleExpand(idx)}
                      key={id}
                    >
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1bh-content"
                        id="panel1bh-header"
                      >
                        <Typography variant="subtitle1">{name}</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <div style={{ width: '100%' }}>
                          <Typography variant="caption">
                            {description}
                          </Typography>
                          <Grid
                            container
                            alignItems="flex-end"
                            spacing={1}
                            justify="space-between"
                            className={classes.algoButtons}
                          >
                            {parameters.length > 0 && (
                              <Grid item>
                                <SetParametersFormButton
                                  parameters={parameters}
                                  schemaId={schemaId}
                                  parametersOnChange={(newParams) => {
                                    this.handleParametersOnChange(
                                      newParams,
                                      idx,
                                    );
                                  }}
                                  schemaOnChange={this.handleSchemaOnChange}
                                />
                              </Grid>
                            )}
                            <Grid item>
                              <Button
                                style={{ color: 'red' }}
                                size="small"
                                onClick={() => this.handleRemove(idx)}
                              >
                                {t('Remove')}
                              </Button>
                            </Grid>
                          </Grid>
                        </div>
                      </AccordionDetails>
                    </Accordion>
                  );
                },
              )}
            </Grid>
          </Grid>
          <div className={classes.executeButton}>
            <Button
              id={ADD_VALIDATION_EXECUTE_BUTTON_ID}
              variant="contained"
              color="primary"
              disabled={!sourceId || selectedValidationAlgorithms.length === 0}
              onClick={this.handleExecute}
            >
              {t('Execute')}
            </Button>
          </div>
          <BackButton className={classes.backButton} />
        </Container>
      </Main>
    );
  }
}

const mapStateToProps = ({ dataset, algorithms, result }) => ({
  datasets: dataset.get('datasets'),
  results: result.get('results'),
  validationAlgorithms: algorithms
    .get('algorithms')
    .filter(({ type }) => type === ALGORITHM_TYPES.VALIDATION),
});

const mapDispatchToProps = {
  dispatchGetDatasets: getDatasets,
  dispatchGetResults: getResults,
  dispatchGetSchemas: getSchemas,
  dispatchCreateValidation: createValidation,
};

const ConnectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps,
)(AddValidation);

const StyledComponent = withStyles(styles, { withTheme: true })(
  ConnectedComponent,
);

const TranslatedComponent = withTranslation()(StyledComponent);

export default withRouter(TranslatedComponent);
