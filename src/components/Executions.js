import React, { Component } from 'react';
import { connect } from 'react-redux';
import { List } from 'immutable';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import { withTranslation } from 'react-i18next';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Alert from '@material-ui/lab/Alert';
import Grid from '@material-ui/core/Grid';

import Main from './common/Main';
import { getDatasets, getAlgorithms, executeAlgorithm } from '../actions';
import Loader from './common/Loader';

const styles = (theme) => ({
  formControl: {
    margin: theme.spacing(1),
    width: '100%',
  },
  content: {
    marginTop: theme.spacing(2),
  },
  selectLabel: {
    width: theme.spacing(10),
  },
  infoAlert: {
    margin: theme.spacing(2),
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
      content: PropTypes.string.isRequired,
      selectLabel: PropTypes.string.isRequired,
      infoAlert: PropTypes.string.isRequired,
    }).isRequired,
  };

  static defaultProps = {
    datasets: null,
    algorithms: null,
  };

  state = (() => {
    const { datasets, algorithms } = this.props;
    return {
      datasetId: datasets?.first()?.id,
      algorithmId: algorithms?.first()?.id,
    };
  })();

  componentDidMount() {
    const { dispatchGetDatasets, dispatchGetAlgorithms } = this.props;
    dispatchGetDatasets();
    dispatchGetAlgorithms();
  }

  componentDidUpdate({ datasets: prevDatasets, algorithms: prevAlgorithms }) {
    const { datasets, algorithms } = this.props;
    if (prevDatasets !== datasets && datasets.size > 0) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ datasetId: datasets.first().id });
    }
    if (prevAlgorithms !== algorithms && algorithms.size > 0) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ algorithmId: algorithms.first().id });
    }
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

    if (datasets.size <= 0) {
      return (
        <Main>
          <Alert severity="info" className={classes.infoAlert}>
            {t('Load a dataset first')}
          </Alert>
        </Main>
      );
    }

    if (algorithms.size <= 0) {
      return (
        <Main>
          <Alert severity="info" className={classes.infoAlert}>
            {t('No algorithm is available')}
          </Alert>
        </Main>
      );
    }

    return (
      <Main>
        <Grid container justify="center" className={classes.content}>
          <Grid container justify="center" alignItems="center">
            <Grid item className={classes.selectLabel}>
              <Typography>{t('Dataset')}</Typography>
            </Grid>
            <Grid item xs={5}>
              <FormControl variant="outlined" className={classes.formControl}>
                <Select
                  id="datasetSelect"
                  value={datasetId || ''}
                  onChange={this.handleDatasetSelectOnChange}
                >
                  {datasets.map(({ id, name }) => (
                    <MenuItem value={id} key={id}>
                      {name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Grid container justify="center" alignItems="center">
            <Grid item className={classes.selectLabel}>
              <Typography>{t('Algorithm')}</Typography>
            </Grid>
            <Grid item xs={5}>
              <FormControl variant="outlined" className={classes.formControl}>
                <Select
                  id="algorithmSelect"
                  value={algorithmId || ''}
                  onChange={this.handleAlgorithmSelectOnChange}
                >
                  {algorithms.map(({ id, name }) => (
                    <MenuItem value={id} key={id}>
                      {name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Grid container justify="center">
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                onClick={this.executeAlgorithm}
              >
                {t('Execute')}
              </Button>
            </Grid>
          </Grid>
        </Grid>
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
