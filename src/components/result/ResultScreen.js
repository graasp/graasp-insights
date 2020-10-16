import React, { Component } from 'react';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import { Map } from 'immutable';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import Button from '@material-ui/core/Button';
import { withTranslation } from 'react-i18next';
import Loader from '../common/Loader';
import JSONFileReader from '../common/JSONFileReader';
import Main from '../common/Main';
import { getResult } from '../../actions';

class ResultScreen extends Component {
  static propTypes = {
    result: PropTypes.instanceOf(Map).isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({ id: PropTypes.string }).isRequired,
    }).isRequired,
    dispatchGetResult: PropTypes.func.isRequired,
    history: PropTypes.shape({
      goBack: PropTypes.func.isRequired,
    }).isRequired,
    activity: PropTypes.bool.isRequired,
    t: PropTypes.func.isRequired,
  };

  defaultProps = {
    result: Map(),
  };

  componentDidMount() {
    const {
      dispatchGetResult,
      match: {
        params: { id },
      },
    } = this.props;

    dispatchGetResult({ id });
  }

  handleBack = () => {
    const {
      history: { goBack },
    } = this.props;
    goBack();
  };

  render() {
    const { result, activity, t } = this.props;

    if (activity) {
      return <Loader />;
    }
    if (result.isEmpty()) {
      return null;
    }

    return (
      <Main>
        <Typography variant="h4">{result.get('name')}</Typography>
        <JSONFileReader
          size={result.get('size')}
          content={result.get('content')}
        />
        <Button variant="contained" color="primary" onClick={this.handleBack}>
          {t('Back')}
        </Button>
      </Main>
    );
  }
}

const mapStateToProps = ({ result }) => ({
  result: result.getIn(['current', 'content']),
  activity: result.getIn(['current', 'activity']).size,
});

const mapDispatchToProps = {
  dispatchGetResult: getResult,
};

const ConnectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ResultScreen);
const TranslatedComponent = withTranslation()(ConnectedComponent);
export default withRouter(TranslatedComponent);
