import React from 'react';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';

import Main from '../common/Main';
import BackButton from '../common/BackButton';
import { ADD_PIPELINE_BACK_BUTTON_ID } from '../../config/selectors';

import PipelineForm from './PipelineForm';

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

const AddPipeline = (props) => {
  const { t, classes } = props;

  return (
    <Main>
      <Container className={classes.content}>
        <Typography variant="h4">{t('Add Pipeline')}</Typography>
        <PipelineForm
          pipelineAlgorithms={[]}
          name=""
          description=""
          handleSave={() => {}}
        />
      </Container>
      <BackButton
        className={classes.backButton}
        id={ADD_PIPELINE_BACK_BUTTON_ID}
      />
    </Main>
  );
};

AddPipeline.propTypes = {
  t: PropTypes.func.isRequired,
  classes: PropTypes.shape({
    content: PropTypes.string.isRequired,
    backButton: PropTypes.string.isRequired,
  }).isRequired,
};

const StyledComponent = withStyles(styles)(AddPipeline);

const TranslatedComponent = withTranslation()(StyledComponent);

export default TranslatedComponent;
