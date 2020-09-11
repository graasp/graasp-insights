import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import List from '@material-ui/core/List';
import HomeIcon from '@material-ui/icons/Home';
import PublishIcon from '@material-ui/icons/Publish';
import CloseIcon from '@material-ui/icons/ExitToApp';
import { withTranslation } from 'react-i18next';
import { HOME_PATH, LOAD_DATASET_PATH } from '../../config/paths';
import {
  HOME_MENU_ITEM_ID,
  LOAD_MENU_ITEM_ID,
  QUIT_MENU_ITEM_ID,
} from '../../config/selectors';

export class MainMenu extends Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
    history: PropTypes.shape({ push: PropTypes.func.isRequired }).isRequired,
    match: PropTypes.shape({ path: PropTypes.string.isRequired }).isRequired,
    location: PropTypes.shape({ pathname: PropTypes.string.isRequired })
      .isRequired,
  };

  handleClick = (path) => {
    const {
      history: { push },
    } = this.props;
    if (path) {
      push(path);
    } else {
      // default to home
      push(HOME_PATH);
    }
  };

  renderCloseApp = () => {
    const { t } = this.props;

    return (
      <MenuItem
        id={QUIT_MENU_ITEM_ID}
        onClick={() => {
          window.close();
        }}
        button
      >
        <ListItemIcon>
          <CloseIcon />
        </ListItemIcon>
        <ListItemText primary={t('Quit')} />
      </MenuItem>
    );
  };

  render() {
    const {
      match: { path },
      t,
    } = this.props;
    return (
      <List>
        <MenuItem
          id={HOME_MENU_ITEM_ID}
          onClick={() => this.handleClick(HOME_PATH)}
          button
          selected={path === HOME_PATH}
        >
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary={t('Home')} />
        </MenuItem>
        <MenuItem
          id={LOAD_MENU_ITEM_ID}
          onClick={() => this.handleClick(LOAD_DATASET_PATH)}
          button
          selected={path === LOAD_DATASET_PATH}
        >
          <ListItemIcon>
            <PublishIcon />
          </ListItemIcon>
          <ListItemText primary={t('Load')} />
        </MenuItem>

        {this.renderCloseApp()}
      </List>
    );
  }
}

const TranslatedComponent = withTranslation()(MainMenu);

export default withRouter(TranslatedComponent);
