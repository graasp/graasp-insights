import React, { Component } from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { MuiThemeProvider } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import {
  HOME_PATH,
  LOAD_DATASET_PATH,
  DATASETS_PATH,
  DATASET_PATH,
  ALGORITHMS_PATH,
  DEVELOPER_PATH,
  SETTINGS_PATH,
  RESULTS_PATH,
  RESULT_PATH,
  EXECUTIONS_PATH,
} from './config/paths';
import theme from './theme';
import LoadDatasetModal from './components/LoadDatasetModal';
import DeveloperScreen from './components/developer/DeveloperScreen';
import Algorithms from './components/Algorithms';
import Datasets from './components/Datasets';
import DatasetScreen from './components/dataset/DatasetScreen';
import SettingsModal from './components/SettingsModal';
import { getLanguage } from './actions';
import Results from './components/Results';
import ResultScreen from './components/result/ResultScreen';
import Executions from './components/Executions';

export class App extends Component {
  state = { height: 0 };

  static propTypes = {
    dispatchGetLanguage: PropTypes.func.isRequired,
    lang: PropTypes.string.isRequired,
    i18n: PropTypes.shape({
      changeLanguage: PropTypes.func.isRequired,
    }).isRequired,
  };

  constructor(props) {
    super(props);
    const { dispatchGetLanguage } = this.props;

    dispatchGetLanguage();
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }

  componentDidUpdate({ lang: prevLang }) {
    const { lang, i18n } = this.props;
    if (lang !== prevLang) {
      i18n.changeLanguage(lang);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  updateWindowDimensions = () => {
    this.setState({ height: window.innerHeight });
  };

  render() {
    const { height } = this.state;

    return (
      <MuiThemeProvider theme={theme}>
        <Router>
          <div className="app" style={{ height }}>
            <Switch>
              <Route exact path={DATASET_PATH} component={DatasetScreen} />
              <Route exact path={DEVELOPER_PATH} component={DeveloperScreen} />
              <Route
                exact
                path={LOAD_DATASET_PATH}
                component={LoadDatasetModal}
              />
              <Route exact path={DATASETS_PATH} component={Datasets} />
              <Route exact path={ALGORITHMS_PATH} component={Algorithms} />
              <Route exact path={RESULTS_PATH} component={Results} />
              <Route exact path={RESULT_PATH} component={ResultScreen} />
              <Route exact path={HOME_PATH} component={Datasets} />
              <Route exact path={SETTINGS_PATH} component={SettingsModal} />
              <Route exact path={EXECUTIONS_PATH} component={Executions} />
            </Switch>
          </div>
        </Router>
      </MuiThemeProvider>
    );
  }
}

const mapStateToProps = ({ settings }) => ({
  lang: settings.get('lang'),
});

const mapDispatchToProps = {
  dispatchGetLanguage: getLanguage,
};

// const StyledApp = withStyles(styles, { withTheme: true })(App);

const ConnectedApp = connect(mapStateToProps, mapDispatchToProps)(App);

const TranslatedApp = withTranslation()(ConnectedApp);

export default TranslatedApp;
