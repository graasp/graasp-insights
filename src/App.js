import React, { Component } from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import { withStyles } from '@material-ui/core';
import { withTranslation } from 'react-i18next';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { HOME_PATH } from './config/paths';
import theme from './theme';

const styles = () => ({
  Main: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },

  toastrIcon: { marginBottom: '-20px', fontSize: '45px' },
});

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
              <Route exact path={HOME_PATH} />
            </Switch>
          </div>
        </Router>
      </MuiThemeProvider>
    );
  }
}

const StyledApp = withStyles(styles, { withTheme: true })(App);

const TranslatedApp = withTranslation()(StyledApp);

export default TranslatedApp;
