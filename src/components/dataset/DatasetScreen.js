import React, { Component } from 'react';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import { Map } from 'immutable';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import Button from '@material-ui/core/Button';
import { withTranslation } from 'react-i18next';
import DatasetReader from './DatasetReader';
import Loader from '../common/Loader';
import Main from '../common/Main';
import { getDataset } from '../../actions';

class DatasetScreen extends Component {
  static propTypes = {
    dataset: PropTypes.instanceOf(Map).isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({ id: PropTypes.string }).isRequired,
    }).isRequired,
    dispatchGetDataset: PropTypes.func.isRequired,
    history: PropTypes.shape({
      goBack: PropTypes.func.isRequired,
    }).isRequired,
    activity: PropTypes.bool.isRequired,
    t: PropTypes.func.isRequired,
  };

  defaultProps = {
    dataset: Map(),
  };

  componentDidMount() {
    const {
      dispatchGetDataset,
      match: {
        params: { id },
      },
    } = this.props;

    dispatchGetDataset({ id });
  }

  handleBack = () => {
    const {
      history: { goBack },
    } = this.props;
    goBack();
  };

  render() {
    const { dataset, activity, t } = this.props;

    if (activity) {
      return <Loader />;
    }
    if (dataset.isEmpty()) {
      return null;
    }

    return (
      <Main>
        <Typography variant="h4">{dataset.get('name')}</Typography>
        <DatasetReader
          size={dataset.get('size')}
          content={dataset.get('content')}
        />
        <Button variant="contained" color="primary" onClick={this.handleBack}>
          {t('Back')}
        </Button>
      </Main>
    );
  }
}

const mapStateToProps = ({ dataset }) => ({
  dataset: dataset.getIn(['current', 'content']),
  activity: dataset.getIn(['current', 'activity']).size,
});

const mapDispatchToProps = {
  dispatchGetDataset: getDataset,
};

const ConnectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps,
)(DatasetScreen);
const TranslatedComponent = withTranslation()(ConnectedComponent);
export default withRouter(TranslatedComponent);
