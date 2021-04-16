import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Button,
  Container,
  Divider,
  ListItemIcon,
  Typography,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { makeStyles } from '@material-ui/core/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CodeIcon from '@material-ui/icons/Code';
import { useSelector } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import {
  ADD_ALGORITHM_PIPELINE_ACCORDION_BUTTON_ID,
  buildPanelAlgorithmPipelineAccordionId,
  buildPanelTypographyAlgorithmId,
  buildRemoveAlgorithmPipelineAccordionButtonId,
} from '../../config/selectors';
import { ERROR_GETTING_ALGORITHM_PIPELINE_MESSAGE } from '../../shared/messages';
import ChooseAlgorithmDialog from './ChooseAlgorithmDialog';

const useStyles = makeStyles(() => ({
  wrapper: {
    width: '100%',
  },
}));

const PipelineAccordion = ({ pipelineAlgorithms, setPipelineAlgorithms }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const [expanded, setExpanded] = useState(false);
  const [selectedAlgorithmId, setSelectedAlgorithmId] = useState('');
  const [open, setOpen] = useState(false);

  const applicationAlgorithms = useSelector(({ algorithms }) =>
    algorithms.get('algorithms'),
  );

  const handleAccordionToggle = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleAlgorithmChange = (event) => {
    setSelectedAlgorithmId(event.target.value);
  };

  const removeAlgorithmFromPipeline = (i) => {
    setPipelineAlgorithms(
      pipelineAlgorithms.filter((alg, index) => index !== i),
    );
    setExpanded(false);
  };

  const openDialog = () => {
    setOpen(true);
  };

  const closeDialog = () => {
    setOpen(false);
  };

  const cancelDialog = () => {
    setSelectedAlgorithmId('');
    closeDialog();
  };

  const addAlgorithmToPipeline = () => {
    const algorithmToPipeline = applicationAlgorithms.find(
      (x) => x.id === selectedAlgorithmId,
    );
    if (algorithmToPipeline) {
      setPipelineAlgorithms([
        ...pipelineAlgorithms,
        { id: algorithmToPipeline.id },
      ]);
    } else {
      toastr.error(t(ERROR_GETTING_ALGORITHM_PIPELINE_MESSAGE));
    }
    setSelectedAlgorithmId('');
    closeDialog();
  };

  const completePipelineAlgorithms = pipelineAlgorithms.map(({ id }) =>
    applicationAlgorithms.find((x) => x.id === id),
  );

  return (
    <Container>
      <Typography variant="h6">{t('Pipeline Schema')}</Typography>
      <div className={classes.wrapper}>
        {completePipelineAlgorithms?.map((algorithm, i) => {
          return (
            <Accordion
              expanded={expanded === `panel${i}`}
              onChange={handleAccordionToggle(`panel${i}`)}
              id={buildPanelAlgorithmPipelineAccordionId(i)}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`panel${i}-content`}
                id={`panel${i}-header`}
              >
                <ListItemIcon>
                  <CodeIcon />
                </ListItemIcon>

                <Typography
                  variant="subtitle1"
                  id={buildPanelTypographyAlgorithmId(algorithm.id, i)}
                >
                  {algorithm.name}
                </Typography>
              </AccordionSummary>
              <AccordionDetails />
              <Divider />
              <AccordionActions id={`accordion${i}-action`}>
                <Button
                  size="small"
                  color="primary"
                  id={buildRemoveAlgorithmPipelineAccordionButtonId(i)}
                  onClick={() => {
                    removeAlgorithmFromPipeline(i);
                  }}
                >
                  {t('Remove')}
                </Button>
              </AccordionActions>
            </Accordion>
          );
        })}
        <Accordion expanded={false} onClick={openDialog}>
          <AccordionSummary
            aria-controls="add-algorithm-content"
            id={ADD_ALGORITHM_PIPELINE_ACCORDION_BUTTON_ID}
          >
            <ListItemIcon>
              <AddIcon />
            </ListItemIcon>
            <Typography variant="subtitle1">{t('Add algorithm')}</Typography>
          </AccordionSummary>
        </Accordion>

        <ChooseAlgorithmDialog
          open={open}
          closeDialog={closeDialog}
          cancelDialog={cancelDialog}
          selectedAlgorithmId={selectedAlgorithmId}
          handleAlgorithmChange={handleAlgorithmChange}
          addAlgorithmToPipeline={addAlgorithmToPipeline}
        />
      </div>
    </Container>
  );
};

PipelineAccordion.propTypes = {
  pipelineAlgorithms: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
    }),
  ).isRequired,
  setPipelineAlgorithms: PropTypes.func.isRequired,
};

export default PipelineAccordion;
