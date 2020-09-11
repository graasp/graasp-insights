import React, { Component } from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { MuiThemeProvider } from '@material-ui/core/styles';
import {
  HOME_PATH,
  LOAD_DATASET_PATH,
  DATASETS_PATH,
  DATASET_PATH,
  ALGORITHMS_PATH,
  DEVELOPER_PATH,
} from './config/paths';
import theme from './theme';
import LoadDataset from './components/LoadDataset';
import DeveloperScreen from './components/developer/DeveloperScreen';
import Algorithms from './components/Algorithms';
import Datasets from './components/Datasets';
import DatasetScreen from './components/dataset/DatasetScreen';

export class App extends Component {
  state = { height: 0 };

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
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
              <Route exact path={LOAD_DATASET_PATH} component={LoadDataset} />
              <Route exact path={DATASETS_PATH} component={Datasets} />
              <Route exact path={ALGORITHMS_PATH} component={Algorithms} />
              <Route exact path={HOME_PATH} component={Datasets} />
            </Switch>
          </div>
        </Router>
      </MuiThemeProvider>
    );
  }
}

// const StyledApp = withStyles(styles, { withTheme: true })(App);

const TranslatedApp = withTranslation()(App);

export default TranslatedApp;
