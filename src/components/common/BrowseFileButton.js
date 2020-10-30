import React from 'react';
import PropTypes from 'prop-types';

import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';

import { BROWSE_FILE_CHANNEL } from '../../shared/channels';

const BrowseFileButton = (props) => {
  const handleBrowse = () => {
    const { options, onBrowseFileCallback } = props;
    window.ipcRenderer.send(BROWSE_FILE_CHANNEL, options);
    window.ipcRenderer.once(BROWSE_FILE_CHANNEL, (event, filePaths) => {
      onBrowseFileCallback(filePaths);
    });
  };

  return (
    <IconButton onClick={handleBrowse}>
      <SearchIcon />
    </IconButton>
  );
};

BrowseFileButton.propTypes = {
  options: PropTypes.shape({
    filters: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        extensions: PropTypes.arrayOf(PropTypes.string).isRequired,
      }),
    ).isRequired,
  }).isRequired,
  onBrowseFileCallback: PropTypes.func.isRequired,
};

export default BrowseFileButton;
