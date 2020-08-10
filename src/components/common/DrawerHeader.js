import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import { withTranslation } from 'react-i18next';
import ListItem from '@material-ui/core/ListItem';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import { DRAWER_HEADER_HEIGHT } from '../../config/constants';

const styles = () => ({
  drawerHeader: {
    height: DRAWER_HEADER_HEIGHT,
  },
  secondaryAction: {
    right: '5px',
  },
});

const DrawerHeader = ({ classes, theme, handleDrawerClose }) => {
  return (
    <ListItem
      classes={{ root: classes.drawerHeader }}
      divider
      ContainerComponent="div"
    >
      <ListItemSecondaryAction classes={{ root: classes.secondaryAction }}>
        <IconButton onClick={handleDrawerClose}>
          {theme.direction === 'ltr' ? (
            <ChevronLeftIcon />
          ) : (
            <ChevronRightIcon />
          )}
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

DrawerHeader.propTypes = {
  classes: PropTypes.shape({
    secondaryAction: PropTypes.string.isRequired,
    drawerHeader: PropTypes.string.isRequired,
  }).isRequired,
  theme: PropTypes.shape({
    direction: PropTypes.string.isRequired,
  }).isRequired,
  handleDrawerClose: PropTypes.func.isRequired,
};

const StyledComponent = withStyles(styles, { withTheme: true })(DrawerHeader);

const TranslatedComponent = withTranslation()(StyledComponent);

export default TranslatedComponent;
