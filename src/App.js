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
  EDIT_ALGORITHM_PATH,
  EDIT_UTILS_PATH,
  ADD_ALGORITHM_PATH,
  VISUALIZATIONS_PATH,
} from './config/paths';
import theme from './theme';
import LoadDatasetModal from './components/LoadDatasetModal';
import DeveloperScreen from './components/developer/DeveloperScreen';
import Algorithms from './components/algorithm/Algorithms';
import EditAlgorithm from './components/algorithm/EditAlgorithm';
import EditUtils from './components/algorithm/EditUtils';
import AddAlgorithm from './components/algorithm/AddAlgorithm';
import Datasets from './components/Datasets';
import DatasetScreen from './components/dataset/DatasetScreen';
import SettingsModal from './components/SettingsModal';
import { getLanguage, checkPythonInstallation } from './actions';
import Results from './components/Results';
import Executions from './components/Executions';
import Visualizations from './components/Visualizations';

export class App extends Component {
  state = { height: 0 };

  static propTypes = {
    dispatchGetLanguage: PropTypes.func.isRequired,
    dispatchCheckPythonInstallation: PropTypes.func.isRequired,
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
    const { dispatchCheckPythonInstallation } = this.props;
    dispatchCheckPythonInstallation();
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
              <Route exact path={RESULT_PATH} component={DatasetScreen} />
              <Route exact path={HOME_PATH} component={Datasets} />
              <Route exact path={SETTINGS_PATH} component={SettingsModal} />
              <Route exact path={EXECUTIONS_PATH} component={Executions} />
              <Route
                exact
                path={EDIT_ALGORITHM_PATH}
                component={EditAlgorithm}
              />
              <Route exact path={EDIT_UTILS_PATH} component={EditUtils} />
              <Route exact path={ADD_ALGORITHM_PATH} component={AddAlgorithm} />
              <Route
                exact
                path={VISUALIZATIONS_PATH}
                component={Visualizations}
              />
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
  dispatchCheckPythonInstallation: checkPythonInstallation,
};

const ConnectedApp = connect(mapStateToProps, mapDispatchToProps)(App);

const TranslatedApp = withTranslation()(ConnectedApp);

export default TranslatedApp;
