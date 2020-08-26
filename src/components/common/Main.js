import React, { Component } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { withTranslation } from 'react-i18next';
import Header from './Header';
import Sidebar from './Sidebar';
import { DRAWER_WIDTH } from '../../config/constants';

const styles = (theme) => ({
  root: {
    display: 'flex',
    height: '100%',
  },
  fullScreen: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flexGrow: 1,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -DRAWER_WIDTH,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: '0 8px',
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
});

class Main extends Component {
  state = {
    open: false,
  };

  static propTypes = {
    classes: PropTypes.shape({
      fullScreen: PropTypes.string.isRequired,
      root: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
      contentShift: PropTypes.string.isRequired,
      drawerHeader: PropTypes.string.isRequired,
    }).isRequired,
    theme: PropTypes.shape({
      direction: PropTypes.string.isRequired,
    }).isRequired,
    children: PropTypes.node.isRequired,
    fullScreen: PropTypes.bool,
  };

  static defaultProps = {
    fullScreen: false,
  };

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { classes, children, fullScreen } = this.props;
    const { open } = this.state;

    return (
      <div className={classes.root}>
        <CssBaseline />
        <Header isSidebarOpen={open} handleDrawerOpen={this.handleDrawerOpen} />

        <Sidebar
          isSidebarOpen={open}
          handleDrawerClose={this.handleDrawerClose}
        />

        <main
          className={clsx(classes.content, {
            [classes.contentShift]: open,
            [classes.fullScreen]: fullScreen,
          })}
        >
          <div className={classes.drawerHeader} />
          {children}
        </main>
      </div>
    );
  }
}

const StyledComponent = withStyles(styles, { withTheme: true })(Main);

const TranslatedComponent = withTranslation()(StyledComponent);

export default TranslatedComponent;
