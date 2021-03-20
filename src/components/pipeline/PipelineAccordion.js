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
  const [algorithm, setAlgorithm] = useState('');
  const [open, setOpen] = useState(false);

  const applicationAlgorithms = useSelector(({ algorithms }) =>
    algorithms.get('algorithms').toArray(),
  );

  const handleAccordionToggle = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleAlgorithmChange = (event) => {
    setAlgorithm(event.target.value);
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
    setAlgorithm('');
    closeDialog();
  };

  const addAlgorithmToPipeline = () => {
    const algorithmToPipeline = applicationAlgorithms.find(
      (x) => x.id === algorithm,
    );
    if (algorithmToPipeline) {
      setPipelineAlgorithms([
        ...pipelineAlgorithms,
        { id: algorithmToPipeline.id },
      ]);
    }
    setAlgorithm('');
    closeDialog();
  };

  return (
    <Container>
      <Typography variant="h6">{t('Pipeline Schema')}</Typography>
      <div className={classes.wrapper}>
        {pipelineAlgorithms?.map((algo, i) => {
          return (
            <Accordion
              expanded={expanded === `panel${i + 1}`}
              onChange={handleAccordionToggle(`panel${i + 1}`)}
              key={`panel${i + 1}-accordion`}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`panel${i + 1}-content`}
                id={`panel${i + 1}-header`}
              >
                <ListItemIcon>
                  <CodeIcon />
                </ListItemIcon>
                <Typography variant="subtitle1" id={`name${i + 1}`}>
                  {applicationAlgorithms.find((x) => x.id === algo.id).name}
                </Typography>
              </AccordionSummary>
              <AccordionDetails />
              <Divider />
              <AccordionActions id={`accordion${i + 1}-action`}>
                <Button
                  size="small"
                  color="primary"
                  id={`button${i + 1}-remove`}
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
            id="add-algorithm-header"
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
                  id="select-algorithm"
                  value={algorithm}
                  onChange={handleAlgorithmChange}
                >
                  {applicationAlgorithms.map((algo) => (
                    <MenuItem value={algo.id} key={algo.id}>
                      {algo.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={cancelDialog} color="primary">
              {t('Cancel')}
            </Button>
            <Button onClick={addAlgorithmToPipeline} color="primary" autoFocus>
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
