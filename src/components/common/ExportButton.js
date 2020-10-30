import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import SaveIcon from '@material-ui/icons/Save';
import { SHOW_SAVE_AS_PROMPT_CHANNEL } from '../../shared/channels';
import { createFlag } from '../../actions/common';

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
  };

  static defaultProps = {
    name: '',
    tooltipText: null,
  };

  handleExport = () => {
    const { dispatchExportFile, name, flagType, channel, id } = this.props;
    dispatchExportFile({ name, flagType, channel, id });
  };

  render() {
    const { tooltipText } = this.props;
    return (
      <Tooltip title={tooltipText} key="visualize">
        <IconButton aria-label="export" onClick={this.handleExport}>
          <SaveIcon />
        </IconButton>
      </Tooltip>
    );
  }
}

const mapDispatchToProps = {
  dispatchExportFile: exportFile,
};

const ConnectedComponent = connect(null, mapDispatchToProps)(ExportButton);

export default ConnectedComponent;
