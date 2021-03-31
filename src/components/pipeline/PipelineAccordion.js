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
import AddIcon from '@material-ui/icons/Add';
import { makeStyles } from '@material-ui/core/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CodeIcon from '@material-ui/icons/Code';
import { useSelector } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import {
  ADD_ALGORITHM_PIPELINE_ACCORDION_BUTTON_ID,
  ALGORITHM_DIALOG_PIPELINE_ACCORDION_SELECT_ID,
  buildPanelAlgorithmPipelineAccordionId,
  buildRemoveAlgorithmPipelineAccordionButtonId,
  CANCEL_ADD_ALGORITHM_PIPELINE_ACCORDION_ID,
  CONFIRM_ADD_ALGORITHM_PIPELINE_ACCORDION_ID,
} from '../../config/selectors';
import { ERROR_GETTING_ALGORITHM_PIPELINE_MESSAGE } from '../../shared/messages';

const useStyles = makeStyles((theme) => ({
  wrapper: {
    width: '100%',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 150,
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
        {completePipelineAlgorithms?.map((algo, i) => {
          return (
            <Accordion
              expanded={expanded === `panel${i + 1}`}
              onChange={handleAccordionToggle(`panel${i + 1}`)}
              id={buildPanelAlgorithmPipelineAccordionId(i)}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`panel${i + 1}-content`}
                id={`panel${i + 1}-header`}
              >
                <ListItemIcon>
                  <CodeIcon />
                </ListItemIcon>
                <Typography variant="subtitle1" id={`name${algo.id}`}>
                  {algo.name}
                </Typography>
              </AccordionSummary>
              <AccordionDetails />
              <Divider />
              <AccordionActions id={`accordion${i + 1}-action`}>
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
                <InputLabel id="input-label-algorithm">
                  {t('Algorithm')}
                </InputLabel>
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
