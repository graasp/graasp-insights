import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { ColorPicker } from 'material-ui-color';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { generateTextColorFromBackground } from '../../utils/color';
import { setSchema } from '../../actions';
import { DEFAULT_TAG_STYLE } from '../../config/constants';

const useStyles = makeStyles((theme) => ({
  content: {
    paddingBottom: theme.spacing(2),
  },
  formControl: {
    minWidth: 200,
  },
}));

const AddSchemaModal = ({ open, handleClose }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const dispatch = useDispatch();
  const datasets = useSelector(({ dataset }) => dataset.get('datasets'));

  const [label, setLabel] = useState('');
  const [tagStyle, setTagStyle] = useState(DEFAULT_TAG_STYLE);
  const [datasetId, setDatasetId] = useState('none');

  const handleLabelOnChange = ({ target: { value } }) => setLabel(value);

  const handleColorOnChange = ({ hex, rgb }) => {
    setTagStyle({
      color: generateTextColorFromBackground(rgb),
      backgroundColor: `#${hex}`,
    });
  };

  const handleDatasetSelect = ({ target: { value } }) => setDatasetId(value);

  const resetForm = () => {
    setLabel('');
    setTagStyle(DEFAULT_TAG_STYLE);
    setDatasetId('none');
  };

  const handleAddSchema = () => {
    dispatch(
      setSchema({
        label,
        tagStyle,
        fromDataset: datasetId !== 'none' ? datasetId : undefined,
      }),
    );
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
      <DialogTitle>{t('Add Schema')}</DialogTitle>
      <DialogContent className={classes.content}>
        <Grid container direction="column" spacing={0}>
          <Grid item>
            <TextField
              onChange={handleLabelOnChange}
              label={t('Label')}
              value={label}
              fullWidth
            />
          </Grid>
          <Grid item>
            <FormControl
              className={classes.formControl}
              variant="outlined"
              margin="normal"
              fullWidth
            >
              <InputLabel id="dataset-select-label">
                {t('Generate from dataset')}
              </InputLabel>
              <Select
                labelId="dataset-select-label"
                value={datasetId}
                onChange={handleDatasetSelect}
                label={t('Generate from dataset')}
              >
                <MenuItem value="none">{t('None')}</MenuItem>
                {datasets.map(({ id, name }) => (
                  <MenuItem value={id} key={id}>
                    {name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item>
            <Grid item container alignItems="center">
              <Grid item>
                <Typography>{`${t('Tag color')}:`}</Typography>
              </Grid>
              <Grid item>
                <ColorPicker
                  value={tagStyle.backgroundColor}
                  disableAlpha
                  hideTextfield
                  deferred
                  onChange={handleColorOnChange}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            resetForm();
            handleClose();
          }}
          color="primary"
        >
          {t('Cancel')}
        </Button>
        <Button
          onClick={() => {
            handleAddSchema();
            resetForm();
            handleClose();
          }}
          color="primary"
          disabled={!label}
        >
          {t('Add Schema')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

AddSchemaModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default AddSchemaModal;
