import React, { useState } from 'react';
import IconButton from '@material-ui/core/IconButton';
import SettingsIcon from '@material-ui/icons/Settings';
import SettingsModal from './SettingsModal';

const SettingsButton = () => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div style={{ display: 'inline-block' }}>
      <IconButton onClick={handleClickOpen}>
        <SettingsIcon color="secondary" />
      </IconButton>
      <SettingsModal
        open={open}
        handleClickOpen={handleClickOpen}
        handleClose={handleClose}
      />
    </div>
  );
};

export default SettingsButton;
