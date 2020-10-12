import React, { Component } from 'react';
import { connect } from 'react-redux';
import { List } from 'immutable';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import { withTranslation } from 'react-i18next';
import Main from './common/Main';
import { getDatasets } from '../actions';
import { EXECUTE_PYTHON_ALGORITHM_CHANNEL } from '../config/channels';
import Loader from './common/Loader';

class Executions extends Component {
  static propTypes = {
    datasets: PropTypes.instanceOf(List),
    t: PropTypes.func.isRequired,
    dispatchGetDatasets: PropTypes.func.isRequired,
  };

  static defaultProps = {
    datasets: null,
  };

  state = (() => {
    const { datasets } = this.props;
    return {
      datasetId: datasets?.first()?.id,
    };
  })();

  componentDidMount() {
    const { dispatchGetDatasets } = this.props;
    dispatchGetDatasets();
  }

  componentDidUpdate({ datasets: prevDatasets }) {
    const { datasets } = this.props;
    if (prevDatasets !== datasets && datasets.size) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ datasetId: datasets.first().id });
    }
  }

  handleDatasetSelectOnChange = (e) => {
    this.setState({ datasetId: e.target.value });
  };

  executePythonAlgorithm = () => {
    const { datasetId } = this.state;
    window.ipcRenderer.send(EXECUTE_PYTHON_ALGORITHM_CHANNEL, {
      id: 1,
      datasetId,
    });
  };

  render() {
    const { datasetId } = this.state;
    const { datasets, t } = this.props;

    if (!datasets || !datasetId) {
      return (
        <Main fullScreen>
          <Loader />
        </Main>
      );
    }

    if (!datasets.size) {
      return <Main fullScreen>{t('Load datasets first')}</Main>;
    }

    return (
      <Main fullScreen>
        <Typography color="inherit" style={{ margin: '2rem' }}>
          {t('Execute algorithm 1 (Hash user ids) on')}
        </Typography>
        <Select value={datasetId} onChange={this.handleDatasetSelectOnChange}>
          {datasets.map(({ id, name }) => {
            return <MenuItem value={id}>{name}</MenuItem>;
          })}
        </Select>
        <Button
          variant="contained"
          color="primary"
          onClick={this.executePythonAlgorithm}
        >
          {t('Run Algorithm')}
        </Button>
      </Main>
    );
  }
}

const mapStateToProps = ({ dataset }) => ({
  datasets: dataset.get('datasets'),
});

const mapDispatchToProps = {
  dispatchGetDatasets: getDatasets,
};

const ConnectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Executions);

export default withTranslation()(ConnectedComponent);
