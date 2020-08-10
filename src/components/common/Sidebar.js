import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import { withTranslation } from 'react-i18next';
import MainMenu from './MainMenu';
import { DRAWER_WIDTH } from '../../config/constants';
import DrawerHeader from './DrawerHeader';

const styles = () => ({
  drawer: {
    width: DRAWER_WIDTH,
    flexShrink: 0,
  },
  drawerPaper: {
    width: DRAWER_WIDTH,
  },
});

const Sidebar = ({ classes, isSidebarOpen, handleDrawerClose }) => {
  return (
    <Drawer
      className={classes.drawer}
      variant="persistent"
      anchor="left"
      open={isSidebarOpen}
      classes={{
        paper: classes.drawerPaper,
      }}
    >
      <DrawerHeader handleDrawerClose={handleDrawerClose} />
      <MainMenu />
    </Drawer>
  );
};

Sidebar.propTypes = {
  classes: PropTypes.shape({
    drawer: PropTypes.string.isRequired,
    drawerPaper: PropTypes.string.isRequired,
  }).isRequired,
  theme: PropTypes.shape({
    direction: PropTypes.string.isRequired,
  }).isRequired,
  isSidebarOpen: PropTypes.bool.isRequired,
  handleDrawerClose: PropTypes.func.isRequired,
};

const StyledComponent = withStyles(styles, { withTheme: true })(Sidebar);

const TranslatedComponent = withTranslation()(StyledComponent);

export default TranslatedComponent;
