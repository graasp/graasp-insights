import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import List from '@material-ui/core/List';
import PieChartIcon from '@material-ui/icons/PieChart';
import CloseIcon from '@material-ui/icons/ExitToApp';
import AssessmentIcon from '@material-ui/icons/Assessment';
import CodeIcon from '@material-ui/icons/Code';
import TimelineIcon from '@material-ui/icons/Timeline';
import TuneIcon from '@material-ui/icons/Tune';
import { withTranslation } from 'react-i18next';
import {
  HOME_PATH,
  ALGORITHMS_PATH,
  DATASETS_PATH,
  DEVELOPER_PATH,
  RESULTS_PATH,
  EXECUTIONS_PATH,
  VISUALIZATIONS_PATH,
} from '../../config/paths';
import {
  ALGORITHMS_MENU_ITEM_ID,
  DATASETS_MENU_ITEM_ID,
  QUIT_MENU_ITEM_ID,
  EXECUTIONS_MENU_ITEM_ID,
  VISUALIZATIONS_MENU_ITEM_ID,
  RESULTS_MENU_ITEM_ID,
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

  renderDeveloperItem = () => {
    const {
      match: { path },
      t,
    } = this.props;
    if (process.env.NODE_ENV === 'development') {
      return (
        <MenuItem
          onClick={() => this.handleClick(DEVELOPER_PATH)}
          selected={path === DEVELOPER_PATH}
          button
        >
          <ListItemIcon>
            <CodeIcon />
          </ListItemIcon>
          <ListItemText primary={t('Developer')} />
        </MenuItem>
      );
    }

    return null;
  };

  renderVisualizations = () => {
    const {
      match: { path },
      t,
    } = this.props;
    return (
      <MenuItem
        id={VISUALIZATIONS_MENU_ITEM_ID}
        onClick={() => this.handleClick(VISUALIZATIONS_PATH)}
        selected={path === VISUALIZATIONS_PATH}
        button
      >
        <ListItemIcon>
          <TimelineIcon />
        </ListItemIcon>
        <ListItemText primary={t('Visualizations')} />
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
          id={DATASETS_MENU_ITEM_ID}
          onClick={() => this.handleClick(DATASETS_PATH)}
          button
          selected={path === DATASETS_PATH}
        >
          <ListItemIcon>
            <PieChartIcon />
          </ListItemIcon>
          <ListItemText primary={t('Datasets')} />
        </MenuItem>
        <MenuItem
          id={ALGORITHMS_MENU_ITEM_ID}
          selected={path === ALGORITHMS_PATH}
          onClick={() => this.handleClick(ALGORITHMS_PATH)}
          button
        >
          <ListItemIcon>
            <CodeIcon />
          </ListItemIcon>
          <ListItemText primary={t('Algorithms')} />
        </MenuItem>
        <MenuItem
          id={EXECUTIONS_MENU_ITEM_ID}
          selected={path === EXECUTIONS_PATH}
          onClick={() => this.handleClick(EXECUTIONS_PATH)}
          button
        >
          <ListItemIcon>
            <TuneIcon />
          </ListItemIcon>
          <ListItemText primary={t('Executions')} />
        </MenuItem>
        <MenuItem
          selected={path === RESULTS_PATH}
          onClick={() => this.handleClick(RESULTS_PATH)}
          button
          id={RESULTS_MENU_ITEM_ID}
        >
          <ListItemIcon>
            <AssessmentIcon />
          </ListItemIcon>
          <ListItemText primary={t('Results')} />
        </MenuItem>
        {this.renderVisualizations()}
        {this.renderDeveloperItem()}
        {this.renderCloseApp()}
      </List>
    );
  }
}

const TranslatedComponent = withTranslation()(MainMenu);

export default withRouter(TranslatedComponent);
