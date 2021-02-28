import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import SaveIcon from '@material-ui/icons/Save';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import {
  EDIT_PIPELINE_SAVE_BUTTON_ID,
  EDIT_PIPELINE_NAME_ID,
  EDIT_PIPELINE_DESCRIPTION_ID,
} from '../../config/selectors';
import PipelineAccordion from './PipelineAccordion';

const PipelineForm = ({
  pipelineAlgorithms,
  name,
  description,
  handleSave,
}) => {
  const { t } = useTranslation();

  const [pipelineName, setPipelineName] = useState(name);
  const [pipelineDescription, setPipelineDescription] = useState(description);

  useEffect(() => {
    setPipelineName(name);
  }, [name]);

  useEffect(() => {
    setPipelineDescription(description);
  }, [description]);

  const handleNameChange = (event) => {
    setPipelineName(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setPipelineDescription(event.target.value);
  };

  return (
    <Grid container spacing={2} justify="center">
      <Grid item xs={7}>
        <PipelineAccordion pipelineAlgorithms={pipelineAlgorithms} />
      </Grid>
      <Grid item xs={5}>
        <TextField
          margin="dense"
          label={t('Pipeline name')}
          value={pipelineName}
          onChange={handleNameChange}
          helperText={`(${t('Required')})`}
          required
          fullWidth
          id={EDIT_PIPELINE_NAME_ID}
        />
        <TextField
          margin="dense"
          label={t('Description')}
          value={pipelineDescription}
          onChange={handleDescriptionChange}
          multiline
          rowsMax={4}
          helperText={`(${t('Optional')})`}
          fullWidth
          id={EDIT_PIPELINE_DESCRIPTION_ID}
        />
      </Grid>
      <Grid item>
        <Button
          variant="contained"
          color="primary"
          startIcon={<SaveIcon />}
          onClick={handleSave}
          id={EDIT_PIPELINE_SAVE_BUTTON_ID}
        >
          {t('Save')}
        </Button>
      </Grid>
    </Grid>
  );
};

PipelineForm.propTypes = {
  pipelineAlgorithms: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }),
  ).isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  handleSave: PropTypes.func.isRequired,
};
export default PipelineForm;
