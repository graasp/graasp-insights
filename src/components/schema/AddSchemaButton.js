import React, { useState } from 'react';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import AddIcon from '@material-ui/icons/Add';
import { useTranslation } from 'react-i18next';
import AddSchemaModal from './AddSchemaModal';
import { SCHEMAS_ADD_BUTTON_ID } from '../../config/selectors';

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

const AddSchemaButton = () => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const classes = useStyles();

  const handleButtonOnClick = () => {
    setOpen(true);
  };

  const handleModalOnClose = () => {
    setOpen(false);
  };

  return (
    <div className={classes.root}>
      <Tooltip placement="left" title={t('Add a Schema')} arrow>
        <IconButton
          variant="contained"
          onClick={handleButtonOnClick}
          className={classes.addButton}
          id={SCHEMAS_ADD_BUTTON_ID}
        >
          <AddIcon />
        </IconButton>
      </Tooltip>
      <AddSchemaModal open={open} onClose={handleModalOnClose} />
    </div>
  );
};

export default AddSchemaButton;
