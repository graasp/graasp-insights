import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import List from '@material-ui/core/List';
import HomeIcon from '@material-ui/icons/Home';
import CloseIcon from '@material-ui/icons/ExitToApp';
import { withTranslation } from 'react-i18next';
import { HOME_PATH } from '../../config/paths';
import { HOME_MENU_ITEM_ID } from '../../config/selectors';

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

        {this.renderCloseApp()}
      </List>
    );
  }
}

const TranslatedComponent = withTranslation()(MainMenu);

export default withRouter(TranslatedComponent);
