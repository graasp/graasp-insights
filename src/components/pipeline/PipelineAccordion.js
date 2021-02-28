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

const useStyles = makeStyles((theme) => ({
  wrapper: {
    width: '100%',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 150,
  },
}));

const PipelineAccordion = ({ pipelineAlgorithms }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const [expanded, setExpanded] = useState(false);

  const handleAccordionToggle = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Container>
      <Typography variant="h6">{t('Pipeline Schema')}</Typography>
      <div className={classes.wrapper}>
        {pipelineAlgorithms?.map((algorithm, i) => {
          return (
            <Accordion
              expanded={expanded === `panel${i + 1}`}
              onChange={handleAccordionToggle(`panel${i + 1}`)}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`panel${i + 1}-content`}
                id={`panel${i + 1}-header`}
              >
                <ListItemIcon>
                  <CodeIcon />
                </ListItemIcon>
                <Typography variant="subtitle1">{algorithm.name}</Typography>
              </AccordionSummary>
              <AccordionDetails />
              <Divider />
              <AccordionActions>
                <Button size="small" color="primary" onClick={() => {}}>
                  {t('Remove')}
                </Button>
              </AccordionActions>
            </Accordion>
          );
        })}
        <Accordion expanded={false} onClick={() => {}}>
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
      </div>
    </Container>
  );
};

PipelineAccordion.propTypes = {
  pipelineAlgorithms: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

export default PipelineAccordion;
