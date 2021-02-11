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
import { setSchema } from '../../actions';
import { DEFAULT_TAG_STYLE } from '../../config/constants';
import {
  ADD_SCHEMA_CANCEL_BUTTON_ID,
  ADD_SCHEMA_CONFIRM_BUTTON_ID,
  ADD_SCHEMA_DESCRIPTION_ID,
  ADD_SCHEMA_FROM_DATASET_SELECT_ID,
  ADD_SCHEMA_LABEL_ID,
  buildDatasetOptionClass,
} from '../../config/selectors';
import { generateTextColorFromBackground } from '../../utils/color';

const useStyles = makeStyles((theme) => ({
  content: {
    paddingBottom: theme.spacing(2),
  },
}));

const AddSchemaModal = ({ open, onClose }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const dispatch = useDispatch();
  const datasets = useSelector(({ dataset }) => dataset.get('datasets'));

  const [label, setLabel] = useState('');
  const [description, setDescription] = useState('');
  const [tagStyle, setTagStyle] = useState(DEFAULT_TAG_STYLE);
  const [datasetId, setDatasetId] = useState('none');

  const handleLabelOnChange = ({ target: { value } }) => setLabel(value);
  const handleDescriptionOnChange = ({ target: { value } }) =>
    setDescription(value);

  const handleColorOnChange = ({ hex, rgb }) => {
    setTagStyle({
      color: generateTextColorFromBackground(rgb),
      backgroundColor: `#${hex}`,
    });
  };

  const handleDatasetSelect = ({ target: { value } }) => setDatasetId(value);

  const resetForm = () => {
    setLabel('');
    setDescription('');
    setTagStyle(DEFAULT_TAG_STYLE);
    setDatasetId('none');
  };

  const handleAddSchema = () => {
    dispatch(
      setSchema({
        label,
        description,
        tagStyle,
        fromDataset: datasetId !== 'none' ? datasetId : undefined,
      }),
    );
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>{t('Add Schema')}</DialogTitle>
      <DialogContent className={classes.content}>
        <Grid container direction="column" spacing={0}>
          <Grid item>
            <TextField
              id={ADD_SCHEMA_LABEL_ID}
              onChange={handleLabelOnChange}
              label={t('Label')}
              value={label}
              fullWidth
            />
          </Grid>
          <Grid item>
            <TextField
              id={ADD_SCHEMA_DESCRIPTION_ID}
              onChange={handleDescriptionOnChange}
              label={t('Description')}
              value={description}
              multiline
              rowsMax={4}
              fullWidth
            />
          </Grid>
          <Grid item>
            <FormControl variant="outlined" margin="normal" fullWidth>
              <InputLabel id="dataset-select-label">
                {t('Generate from dataset')}
              </InputLabel>
              <Select
                id={ADD_SCHEMA_FROM_DATASET_SELECT_ID}
                labelId="dataset-select-label"
                value={datasetId}
                onChange={handleDatasetSelect}
                label={t('Generate from dataset')}
              >
                <MenuItem value="none">{t('None')}</MenuItem>
                {datasets.map(({ id, name }) => (
                  <MenuItem
                    value={id}
                    key={id}
                    className={buildDatasetOptionClass(name)}
                  >
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
          id={ADD_SCHEMA_CANCEL_BUTTON_ID}
          onClick={() => {
            resetForm();
            onClose();
          }}
          color="primary"
        >
          {t('Cancel')}
        </Button>
        <Button
          id={ADD_SCHEMA_CONFIRM_BUTTON_ID}
          onClick={() => {
            handleAddSchema();
            resetForm();
            onClose();
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
  onClose: PropTypes.func.isRequired,
};

export default AddSchemaModal;
