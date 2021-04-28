import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Tooltip from '@material-ui/core/Tooltip';
import { withTranslation } from 'react-i18next';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import SaveIcon from '@material-ui/icons/Save';
import { SHOW_SAVE_AS_PROMPT_CHANNEL } from '../../shared/channels';
import { createFlag } from '../../actions/common';
import { FILE_FORMATS } from '../../shared/constants';

const exportFile = ({ name, flagType, channel, id }) => (dispatch) => {
  window.ipcRenderer.send(SHOW_SAVE_AS_PROMPT_CHANNEL, name);
  window.ipcRenderer.once(SHOW_SAVE_AS_PROMPT_CHANNEL, (event, path) => {
    const flag = createFlag(flagType);
    if (path) {
      dispatch(flag(true));
      window.ipcRenderer.send(channel, {
        path,
        id,
      });

      window.ipcRenderer.once(channel, (e, response) => {
        dispatch(response);
        dispatch(flag(false));
      });
    } else {
      dispatch(flag(false));
    }
  });
};

class ExportButton extends Component {
  static propTypes = {
    dispatchExportFile: PropTypes.func.isRequired,
    name: PropTypes.string,
    flagType: PropTypes.string.isRequired,
    channel: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    tooltipText: PropTypes.string,
    t: PropTypes.func.isRequired,
    isTabular: PropTypes.bool,
  };

  static defaultProps = {
    name: '',
    tooltipText: null,
    isTabular: false,
  };

  state = {
    anchorEl: null,
  };

  handleExport = (format = FILE_FORMATS.JSON) => {
    const { dispatchExportFile, name, flagType, channel, id } = this.props;
    dispatchExportFile({ name: `${name}.${format}`, flagType, channel, id });
    this.handleClose();
  };

  handleSelectFormat = (event) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    const { tooltipText, t, isTabular } = this.props;
    const { anchorEl } = this.state;

    return (
      <>
        <Tooltip title={tooltipText}>
          <IconButton
            aria-label={t('export')}
            onClick={(event) => {
              return isTabular
                ? this.handleSelectFormat(event)
                : this.handleExport();
            }}
          >
            <SaveIcon />
          </IconButton>
        </Tooltip>
        {isTabular && (
          <Menu
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={this.handleClose}
          >
            <MenuItem onClick={() => this.handleExport(FILE_FORMATS.JSON)}>
              {`${t('Export as')} JSON`}
            </MenuItem>
            <MenuItem onClick={() => this.handleExport(FILE_FORMATS.CSV)}>
              {`${t('Export as')} CSV`}
            </MenuItem>
          </Menu>
        )}
      </>
    );
  }
}

const mapDispatchToProps = {
  dispatchExportFile: exportFile,
};

const ConnectedComponent = connect(null, mapDispatchToProps)(ExportButton);
const TranslatedComponent = withTranslation()(ConnectedComponent);
export default TranslatedComponent;
