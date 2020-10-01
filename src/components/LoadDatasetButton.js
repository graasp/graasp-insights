import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import Tooltip from '@material-ui/core/Tooltip';
import LoadDataset from './LoadDataset';

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: theme.spacing(2),
  },
  addButton: {
    color: theme.palette.secondary.main,
    backgroundColor: theme.palette.primary.main,
    position: 'fixed',
    right: theme.spacing(2),
    bottom: theme.spacing(2),
    '&:hover, &.Mui-focusVisible': {
      backgroundColor: theme.palette.primary.main,
    },
  },
}));

const LoadDatasetButton = () => {
  const [open, setOpen] = useState(false);
  const classes = useStyles();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className={classes.root}>
      <Tooltip placement="left" title="Add dataset" arrow>
        <IconButton
          variant="contained"
          className={classes.addButton}
          onClick={handleClickOpen}
        >
          <AddIcon />
        </IconButton>
      </Tooltip>
      <LoadDataset
        open={open}
        setOpen={setOpen}
        handleClickOpen={handleClickOpen}
        handleClose={handleClose}
      />
    </div>
  );
};

export default LoadDatasetButton;
