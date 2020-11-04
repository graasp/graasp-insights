import React, { Component } from 'react';
import { connect } from 'react-redux';
import { List } from 'immutable';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import { withTranslation } from 'react-i18next';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import Alert from '@material-ui/lab/Alert';
import Tooltip from '@material-ui/core/Tooltip';

import Main from './common/Main';
import { getDatasets, getAlgorithms, executeAlgorithm } from '../actions';
import Loader from './common/Loader';
import PythonLogo from './execution/PythonLogo';
import {
  ERROR_PYTHON_NOT_INSTALLED_MESSAGE,
  buildPythonWrongVersionMessage,
} from '../shared/messages';

const styles = (theme) => ({
  formControl: {
    margin: theme.spacing(1),
    width: '100%',
  },
  infoAlert: {
    margin: theme.spacing(2),
  },
  container: {
    width: '50%',
    margin: '0 auto',
    marginTop: theme.spacing(2),
  },
  buttonContainer: {
    textAlign: 'center',
    marginTop: theme.spacing(2),
  },
  buttonWrapper: {
    display: 'inline-block',
  },
  pythonLogo: {
    position: 'fixed',
    right: 0,
    marginRight: theme.spacing(2),
  },
});

class Executions extends Component {
  static propTypes = {
    datasets: PropTypes.instanceOf(List),
    algorithms: PropTypes.instanceOf(List),
    t: PropTypes.func.isRequired,
    dispatchGetDatasets: PropTypes.func.isRequired,
    dispatchGetAlgorithms: PropTypes.func.isRequired,
    dispatchExecuteAlgorithm: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
    classes: PropTypes.shape({
      formControl: PropTypes.string.isRequired,
      infoAlert: PropTypes.string.isRequired,
      container: PropTypes.string.isRequired,
      buttonContainer: PropTypes.string.isRequired,
      buttonWrapper: PropTypes.string.isRequired,
      pythonLogo: PropTypes.string.isRequired,
    }).isRequired,
    pythonVersion: PropTypes.shape({
      valid: PropTypes.bool,
      version: PropTypes.string,
    }).isRequired,
  };

  static defaultProps = {
    datasets: null,
    algorithms: null,
  };

  state = {
    datasetId: '',
    algorithmId: '',
  };

  componentDidMount() {
    const { dispatchGetDatasets, dispatchGetAlgorithms } = this.props;
    dispatchGetDatasets();
    dispatchGetAlgorithms();
  }

  handleDatasetSelectOnChange = (e) => {
    this.setState({ datasetId: e.target.value });
  };

  handleAlgorithmSelectOnChange = (e) => {
    this.setState({ algorithmId: e.target.value });
  };

  executeAlgorithm = () => {
    const { dispatchExecuteAlgorithm, algorithms } = this.props;
    const { datasetId, algorithmId } = this.state;
    const { language } = algorithms.find(({ id }) => id === algorithmId);
    if (language) {
      dispatchExecuteAlgorithm({ datasetId, algorithmId, language });
    }
  };

  renderExecuteButton = () => {
    const { datasetId, algorithmId } = this.state;
    const { t, pythonVersion, classes } = this.props;
    const button = (
      <div className={classes.buttonWrapper}>
        <Button
          variant="contained"
          color="primary"
          onClick={this.executeAlgorithm}
          disabled={!datasetId || !algorithmId || !pythonVersion?.valid}
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
    const { datasetId, algorithmId } = this.state;
    const { datasets, algorithms, t, classes, isLoading } = this.props;

    if (isLoading) {
      return (
        <Main fullScreen>
          <Loader />
        </Main>
      );
    }

    if (!datasets.size) {
      return (
        <Main>
          <Alert severity="info" className={classes.infoAlert}>
            {t('Load a dataset first')}
          </Alert>
        </Main>
      );
    }

    if (!algorithms.size) {
      return (
        <Main>
          <Alert severity="info" className={classes.infoAlert}>
            {t('No algorithms are available')}
          </Alert>
        </Main>
      );
    }

    return (
      <Main>
        <div className={classes.container}>
          <div className={classes.pythonLogo}>
            <PythonLogo />
          </div>
          <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel id="dataset-select">Dataset</InputLabel>
            <Select
              labelId="dataset-select"
              value={datasetId}
              onChange={this.handleDatasetSelectOnChange}
              label={t('Dataset')}
            >
              {datasets.map(({ id, name }) => (
                <MenuItem value={id} key={id}>
                  {name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel id="algorithm-select">Algorithm</InputLabel>
            <Select
              labelId="algorithm-select"
              value={algorithmId}
              onChange={this.handleAlgorithmSelectOnChange}
              label={t('Algorithm')}
            >
              {algorithms.map(({ id, name }) => (
                <MenuItem value={id} key={id}>
                  {name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {this.renderExecuteButton()}
        </div>
      </Main>
    );
  }
}

const mapStateToProps = ({ dataset, algorithms, settings }) => ({
  datasets: dataset.get('datasets'),
  algorithms: algorithms.get('algorithms'),
  isLoading:
    dataset.getIn(['activity']).size > 0 &&
    algorithms.getIn(['activity']).size > 0,
  pythonVersion: settings.get('pythonVersion'),
});

const mapDispatchToProps = {
  dispatchGetDatasets: getDatasets,
  dispatchGetAlgorithms: getAlgorithms,
  dispatchExecuteAlgorithm: executeAlgorithm,
};

const ConnectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Executions);

const StyledComponent = withStyles(styles, { withTheme: true })(
  ConnectedComponent,
);

export default withTranslation()(StyledComponent);
