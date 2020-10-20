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

import Main from './common/Main';
import { getDatasets, getAlgorithms, executeAlgorithm } from '../actions';
import Loader from './common/Loader';

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
  button: {
    display: 'block',
    margin: '0 auto',
    marginTop: theme.spacing(2),
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
      button: PropTypes.string.isRequired,
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
          <Button
            variant="contained"
            color="primary"
            onClick={this.executeAlgorithm}
            className={classes.button}
            disabled={!datasetId || !algorithmId}
          >
            {t('Execute')}
          </Button>
        </div>
      </Main>
    );
  }
}

const mapStateToProps = ({ dataset, algorithms }) => ({
  datasets: dataset.get('datasets'),
  algorithms: algorithms.get('algorithms'),
  isLoading:
    dataset.getIn(['current', 'activity']).size > 0 &&
    algorithms.getIn(['activity']).size > 0,
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
