import React, { Component } from 'react';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import { Map } from 'immutable';
import Alert from '@material-ui/lab/Alert';
import Container from '@material-ui/core/Container';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { withTranslation } from 'react-i18next';
import Loader from '../common/Loader';
import JSONFileEditor from '../common/JSONFileEditor';
import Main from '../common/Main';
import { getResult } from '../../actions';
import BackButton from '../common/BackButton';

const styles = (theme) => ({
  wrapper: {
    padding: theme.spacing(2),
  },
  infoAlert: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  backButton: {
    float: 'left',
    position: 'absolute',
  },
  title: {
    marginBottom: theme.spacing(2),
  },
});

class ResultScreen extends Component {
  static propTypes = {
    result: PropTypes.instanceOf(Map).isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({ id: PropTypes.string }).isRequired,
    }).isRequired,
    dispatchGetResult: PropTypes.func.isRequired,
    activity: PropTypes.bool.isRequired,
    t: PropTypes.func.isRequired,
    classes: PropTypes.shape({
      wrapper: PropTypes.string.isRequired,
      infoAlert: PropTypes.string.isRequired,
      backButton: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
    }).isRequired,
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

  render() {
    const { result, activity, t, classes } = this.props;

    if (activity) {
      return (
        <Main fullScreen>
          <Loader />
        </Main>
      );
    }
    if (result.isEmpty()) {
      return (
        <Main>
          <Container>
            <Alert severity="error" className={classes.infoAlert}>
              {t('An unexpected error happened while opening the result.')}
            </Alert>
            <BackButton />
          </Container>
        </Main>
      );
    }

    return (
      <Main>
        <div className={classes.wrapper}>
          <BackButton className={classes.backButton} />
          <Typography className={classes.title} variant="h4" align="center">
            {result.get('name')}
          </Typography>
          <JSONFileEditor
            id={result.get('id')}
            size={result.get('size')}
            content={result.get('content')}
            collapsed={2}
          />
        </div>
      </Main>
    );
  }
}

const mapStateToProps = ({ result }) => ({
  result: result.getIn(['current', 'content']),
  activity: Boolean(result.getIn(['activity']).size),
});

const mapDispatchToProps = {
  dispatchGetResult: getResult,
};

const ConnectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ResultScreen);
const StyledComponent = withStyles(styles, { withTheme: true })(
  ConnectedComponent,
);

const TranslatedComponent = withTranslation()(StyledComponent);
export default withRouter(TranslatedComponent);
