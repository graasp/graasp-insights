import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import {
  PIPELINE_FORM_SAVE_BUTTON_ID,
  EDIT_PIPELINE_NAME_ID,
  EDIT_PIPELINE_DESCRIPTION_ID,
} from '../../config/selectors';
import PipelineAccordion from './PipelineAccordion';
import { getAlgorithms } from '../../actions';

const PipelineForm = (props) => {
  const {
    name,
    description,
    confirmButtonStartIcon,
    confirmButtonText,
    onSubmit,
    pipelineAlgorithms,
  } = props;
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [pipelineAlgos, setPipelineAlgos] = useState(pipelineAlgorithms);
  const [pipelineName, setPipelineName] = useState(name);
  const [pipelineDescription, setPipelineDescription] = useState(description);

  useEffect(() => {
    dispatch(getAlgorithms());
  }, [dispatch]);

  useEffect(() => {
    setPipelineAlgos(pipelineAlgorithms);
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

  const handleButtonOnClick = () => {
    const metadata = {
      name: pipelineName,
      description: pipelineDescription,
      algorithms: pipelineAlgos,
    };
    onSubmit(metadata);
  };

  return (
    <Grid container spacing={2} justify="center">
      <Grid item xs={7}>
        <PipelineAccordion
          pipelineAlgorithms={pipelineAlgos}
          setPipelineAlgorithms={setPipelineAlgos}
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
          disabled={!(pipelineName.length > 0 && pipelineAlgos.length > 1)}
          variant="contained"
          color="primary"
          startIcon={confirmButtonStartIcon}
          onClick={handleButtonOnClick}
          id={PIPELINE_FORM_SAVE_BUTTON_ID}
        >
          {confirmButtonText}
        </Button>
      </Grid>
    </Grid>
  );
};

PipelineForm.defaultProps = {
  name: '',
  description: '',
  pipelineAlgorithms: [],
};

PipelineForm.propTypes = {
  pipelineAlgorithms: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }),
  ),
  name: PropTypes.string,
  description: PropTypes.string,
  confirmButtonStartIcon: PropTypes.func.isRequired,
  confirmButtonText: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
};
export default PipelineForm;
