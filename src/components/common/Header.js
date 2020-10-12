import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { DRAWER_BUTTON_ID } from '../../config/selectors';
import { DRAWER_WIDTH } from '../../config/constants';
import SettingsButton from '../SettingsButton';

const styles = (theme) => ({
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${DRAWER_WIDTH}px)`,
    marginLeft: DRAWER_WIDTH,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(3),
  },
  hide: {
    visibility: 'hidden',
  },
  toolbar: {
    justifyContent: 'space-between',
    padding: '0px',
  },
  rightButtons: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
});

const Header = ({ classes, handleDrawerOpen, isSidebarOpen }) => {
  return (
    <AppBar
      position="fixed"
      className={clsx(classes.appBar, {
        [classes.appBarShift]: isSidebarOpen,
      })}
    >
      <Toolbar disableGutters={!isSidebarOpen} className={classes.toolbar}>
        <IconButton
          id={DRAWER_BUTTON_ID}
          color="inherit"
          aria-label="Open drawer"
          onClick={handleDrawerOpen}
          className={clsx(classes.menuButton, isSidebarOpen && classes.hide)}
        >
          <MenuIcon />
        </IconButton>
        <div className={classes.rightButtons}>
          <SettingsButton />
        </div>
      </Toolbar>
    </AppBar>
  );
};

Header.propTypes = {
  classes: PropTypes.shape({
    appBar: PropTypes.string.isRequired,
    appBarShift: PropTypes.string.isRequired,
    menuButton: PropTypes.string.isRequired,
    hide: PropTypes.string.isRequired,
    toolbar: PropTypes.string.isRequired,
    rightButtons: PropTypes.string.isRequired,
  }).isRequired,
  theme: PropTypes.shape({
    direction: PropTypes.string.isRequired,
  }).isRequired,
  isSidebarOpen: PropTypes.bool.isRequired,
  handleDrawerOpen: PropTypes.func.isRequired,
};

const StyledComponent = withStyles(styles, { withTheme: true })(Header);

export default StyledComponent;
