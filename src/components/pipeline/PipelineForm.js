import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import SaveIcon from '@material-ui/icons/Save';
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import {
  EDIT_PIPELINE_SAVE_BUTTON_ID,
  EDIT_PIPELINE_NAME_ID,
  EDIT_PIPELINE_DESCRIPTION_ID,
} from '../../config/selectors';
import PipelineAccordion from './PipelineAccordion';
import {
  savePipeline,
  addPipeline,
  getAlgorithms,
  clearAlgorithm,
} from '../../actions';
import { PIPELINES_PATH } from '../../config/paths';

const PipelineForm = ({
  id,
  pipelineAlgorithms,
  name,
  description,
  handleSave,
  handleHistory,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [pipeline, setPipeline] = useState(pipelineAlgorithms);
  const [pipelineName, setPipelineName] = useState(name);
  const [pipelineDescription, setPipelineDescription] = useState(description);

  useEffect(() => {
    dispatch(getAlgorithms());
    // clean-up function
    return () => {
      dispatch(clearAlgorithm());
    };
  }, [dispatch]);

  useEffect(() => {
    setPipeline(pipelineAlgorithms);
  }, [pipelineAlgorithms]);

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

  const handleSavePipeline = () => {
    const metadata = {
      id,
      name: pipelineName,
      description: pipelineDescription,
      algorithms: pipeline,
    };
    dispatch(savePipeline({ metadata }));
    return handleHistory(PIPELINES_PATH);
  };

  const handleAddPipeline = () => {
    const metadata = {
      name: pipelineName,
      description: pipelineDescription,
      algorithms: pipeline,
    };
    dispatch(addPipeline({ metadata }));
    return handleHistory(PIPELINES_PATH);
  };

  return (
    <Grid container spacing={2} justify="center">
      <Grid item xs={7}>
        <PipelineAccordion
          pipelineAlgorithms={pipeline}
          setPipelineAlgorithms={setPipeline}
        />
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
          disabled={!(pipelineName.length > 0 && pipeline.length > 1)}
          variant="contained"
          color="primary"
          startIcon={handleSave ? <SaveIcon /> : <AddIcon />}
          onClick={handleSave ? handleSavePipeline : handleAddPipeline}
          id={EDIT_PIPELINE_SAVE_BUTTON_ID}
        >
          {handleSave ? t('Save') : t('Add')}
        </Button>
      </Grid>
    </Grid>
  );
};

PipelineForm.propTypes = {
  id: PropTypes.string.isRequired,
  pipelineAlgorithms: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }),
  ).isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  handleSave: PropTypes.bool.isRequired,
  handleHistory: PropTypes.func.isRequired,
};
export default PipelineForm;
