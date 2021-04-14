import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Select,
  InputLabel,
  FormControl,
  MenuItem,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import {
  ALGORITHM_DIALOG_PIPELINE_ACCORDION_SELECT_ID,
  CANCEL_ADD_ALGORITHM_PIPELINE_ACCORDION_ID,
  CONFIRM_ADD_ALGORITHM_PIPELINE_ACCORDION_ID,
} from '../../config/selectors';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 150,
  },
}));

const ChooseAlgorithmDialog = ({
  open,
  closeDialog,
  cancelDialog,
  selectedAlgorithmId,
  handleAlgorithmChange,
  addAlgorithmToPipeline,
}) => {
  const { t } = useTranslation();
  const classes = useStyles();

  const applicationAlgorithms = useSelector(({ algorithms }) =>
    algorithms.get('algorithms'),
  );

  return (
    <Dialog
      open={open}
      onClose={closeDialog}
      aria-labelledby="alert-dialog-algorithms"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {t('Choose your algorithm')}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-algorithm">
          <FormControl className={classes.formControl}>
            <InputLabel id="input-label-algorithm">{t('Algorithm')}</InputLabel>
            <Select
              id={ALGORITHM_DIALOG_PIPELINE_ACCORDION_SELECT_ID}
              value={selectedAlgorithmId}
              onChange={handleAlgorithmChange}
            >
              {applicationAlgorithms.map(({ id, name }) => (
                <MenuItem value={id} id={id}>
                  {name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={cancelDialog}
          id={CANCEL_ADD_ALGORITHM_PIPELINE_ACCORDION_ID}
          color="primary"
        >
          {t('Cancel')}
        </Button>
        <Button
          onClick={addAlgorithmToPipeline}
          id={CONFIRM_ADD_ALGORITHM_PIPELINE_ACCORDION_ID}
          color="primary"
          autoFocus
        >
          {t('Confirm')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ChooseAlgorithmDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  closeDialog: PropTypes.func.isRequired,
  cancelDialog: PropTypes.func.isRequired,
  selectedAlgorithmId: PropTypes.string.isRequired,
  handleAlgorithmChange: PropTypes.func.isRequired,
  addAlgorithmToPipeline: PropTypes.func.isRequired,
};

export default ChooseAlgorithmDialog;
