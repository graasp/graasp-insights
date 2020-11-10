import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import { List } from 'immutable';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    justifyContent: 'center',
    margin: theme.spacing(2),
  },
  subcontainer: {
    display: 'flex',
    alignItems: 'center',
  },
  formControl: {
    margin: theme.spacing(1),
    width: '100%',
  },
  select: {
    padding: 0,
    width: '300px',
  },
  inputLabel: {
    backgroundColor: '#F7F7F7',
  },
}));

const AddVisualizationForm = ({
  selectedDatasetId,
  setSelectedDatasetId,
  fetchDatasetToBeVisualized,
  datasets,
}) => {
  const { t } = useTranslation();
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <div className={classes.subcontainer}>
        <FormControl
          variant="outlined"
          className={classes.formControl}
          margin="dense"
        >
          <InputLabel id="dataset-select" className={classes.inputLabel}>
            {t('Dataset')}
          </InputLabel>
          <Select
            labelId="dataset-select"
            value={selectedDatasetId}
            onChange={(e) => setSelectedDatasetId(e.target.value)}
            label={t('Dataset')}
            className={classes.select}
          >
            {datasets.map(({ id, name }) => (
              <MenuItem value={id} key={id}>
                {name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <div>
          <Button
            variant="contained"
            color="primary"
            disabled={!selectedDatasetId}
            onClick={fetchDatasetToBeVisualized}
          >
            {t('Visualize')}
          </Button>
        </div>
      </div>
    </div>
  );
};

AddVisualizationForm.propTypes = {
  selectedDatasetId: PropTypes.string.isRequired,
  setSelectedDatasetId: PropTypes.func.isRequired,
  fetchDatasetToBeVisualized: PropTypes.func.isRequired,
  datasets: PropTypes.instanceOf(List).isRequired,
};

export default AddVisualizationForm;
