import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import { List } from 'immutable';
import SchemaTag from '../common/SchemaTag';
import { SCHEMA_TYPES } from '../../shared/constants';

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
  schemaTag: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
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

  const selectedSchemaType = datasets.find(({ id }) => id === selectedDatasetId)
    ?.schemaType;
  const isGraasp = selectedSchemaType === SCHEMA_TYPES.GRAASP;
  const button = (
    <Button
      variant="contained"
      color="primary"
      disabled={!isGraasp}
      onClick={fetchDatasetToBeVisualized}
    >
      {t('Visualize')}
    </Button>
  );

  return (
    <div className={classes.container}>
      <div className={classes.subcontainer}>
        <FormControl
          variant="outlined"
          className={classes.formControl}
          margin="dense"
        >
          <InputLabel id="dataset-select">{t('Dataset')}</InputLabel>
          <Select
            labelId="dataset-select"
            value={selectedDatasetId}
            onChange={(e) => setSelectedDatasetId(e.target.value)}
            label={t('Dataset')}
            className={classes.select}
          >
            {datasets.map(({ id, name, schemaType }) => (
              <MenuItem value={id} key={id}>
                {name}
                {schemaType && schemaType !== SCHEMA_TYPES.NONE && (
                  <SchemaTag
                    schemaType={schemaType}
                    className={classes.schemaTag}
                  />
                )}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <div>
          {!selectedDatasetId || isGraasp ? (
            button
          ) : (
            <Tooltip title={t('Only Graasp datasets can be visualized')}>
              <div>{button}</div>
            </Tooltip>
          )}
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
