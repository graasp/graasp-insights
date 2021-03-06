import React, { useEffect } from 'react';
import { withTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import SaveIcon from '@material-ui/icons/Save';

import Main from '../common/Main';
import BackButton from '../common/BackButton';

import { EDIT_PIPELINE_BACK_BUTTON_ID } from '../../config/selectors';
import { clearPipeline, getPipeline, savePipeline } from '../../actions';
import PipelineForm from './PipelineForm';
import { PIPELINES_PATH } from '../../config/paths';

const styles = (theme) => ({
  backButton: {
    position: 'fixed',
    right: theme.spacing(2),
    bottom: theme.spacing(2),
  },
  content: {
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
  },
});

const EditPipeline = (props) => {
  const {
    t,
    classes,
    match: {
      params: { id },
    },
    history: { push },
  } = props;

  const pipeline = useSelector((state) => state.pipeline.get('current'));

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getPipeline({ id }));
    // clean-up function
    return () => {
      dispatch(clearPipeline());
    };
  }, [dispatch, id]);

  const handleSubmitPipelineForm = (data) => {
    const metadata = {
      ...data,
      id: pipeline.get('id') || '',
    };
    dispatch(savePipeline({ metadata }));
    push(PIPELINES_PATH);
  };

  return (
    <Main>
      <Container className={classes.content}>
        <Typography variant="h4">{t('Edit Pipeline')}</Typography>
        <PipelineForm
          pipelineAlgorithms={pipeline.get('algorithms') || []}
          name={pipeline.get('name') || ''}
          description={pipeline.get('description') || ''}
          confirmButtonStartIcon={<SaveIcon />}
          confirmButtonText={t('Save')}
          onSubmit={handleSubmitPipelineForm}
        />
      </Container>
      <BackButton
        className={classes.backButton}
        id={EDIT_PIPELINE_BACK_BUTTON_ID}
      />
    </Main>
  );
};

EditPipeline.propTypes = {
  t: PropTypes.func.isRequired,
  classes: PropTypes.shape({
    content: PropTypes.string.isRequired,
    backButton: PropTypes.string.isRequired,
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

const StyledComponent = withStyles(styles)(EditPipeline);

const TranslatedComponent = withTranslation()(StyledComponent);

export default withRouter(TranslatedComponent);
