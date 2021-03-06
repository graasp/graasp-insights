import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import Button from '@material-ui/core/Button';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import SaveIcon from '@material-ui/icons/Save';
import { makeStyles } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import Alert from '@material-ui/lab/Alert';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { Map } from 'immutable';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { PARAMETER_TYPES } from '../../shared/constants';
import { setFieldSelectorAttributes } from '../../shared/utils';
import { isParameterValid } from '../../utils/parameter';
import FieldSelector from './FieldSelector';
import {
  SET_PARAMETERS_SAVE_BUTTON_ID,
  SET_PARAMETERS_BACK_BUTTON_ID,
  buildParameterValueInputId,
} from '../../config/selectors';

const useStyles = makeStyles((theme) => ({
  content: {
    paddingBottom: theme.spacing(2),
  },
  paramTextField: {
    display: 'block',
  },
}));

const SetParametersFormModal = (props) => {
  const {
    t,
    parameters: parametersSource,
    parametersOnChange,
    schemaOnChange,
    open,
    handleClose,
    schemas,
    schemaId: schemaIdSource,
  } = props;
  const classes = useStyles();

  const [parameters, setParameters] = useState(parametersSource);
  const [schemaId, setSchemaId] = useState(schemaIdSource);

  useEffect(() => {
    setParameters(parametersSource);
  }, [parametersSource]);

  useEffect(() => {
    setSchemaId(schemaIdSource);
  }, [schemaIdSource]);

  const updateParam = (newValue, paramIdx) => {
    const updatedParam = { ...parameters[paramIdx], value: newValue };

    // replace the param at the right index with the updated one
    const updatedParameters = parameters.slice();
    updatedParameters.splice(paramIdx, 1, updatedParam);

    setParameters(updatedParameters);
  };

  const renderParam = (param, paramIdx) => {
    const { name, type: paramType, value } = param;
    const invalid = !isParameterValid(param);
    switch (paramType) {
      case PARAMETER_TYPES.STRING_INPUT: {
        return (
          <TextField
            variant="outlined"
            size="small"
            value={value}
            onChange={(event) => updateParam(event.target.value, paramIdx)}
            className={classes.paramTextField}
            id={buildParameterValueInputId(name)}
          />
        );
      }
      case PARAMETER_TYPES.INTEGER_INPUT: {
        return (
          <TextField
            variant="outlined"
            size="small"
            value={value}
            onChange={(event) => updateParam(event.target.value, paramIdx)}
            error={invalid}
            helperText={invalid && t('Please provide an integer')}
            className={classes.paramTextField}
            id={buildParameterValueInputId(name)}
          />
        );
      }
      case PARAMETER_TYPES.FLOAT_INPUT: {
        return (
          <TextField
            variant="outlined"
            size="small"
            value={value}
            onChange={(event) => updateParam(event.target.value, paramIdx)}
            error={invalid}
            helperText={invalid && t('Please provide a number')}
            className={classes.paramTextField}
            id={buildParameterValueInputId(name)}
          />
        );
      }
      case PARAMETER_TYPES.FIELD_SELECTOR: {
        let fieldSelection;
        if (schemaId in value) {
          fieldSelection = value[schemaId];
        } else {
          const schema = schemas.get(schemaId)?.schema;
          fieldSelection = setFieldSelectorAttributes(schema, false, 1);
        }

        if (_.isEmpty(fieldSelection)) {
          return (
            <Alert severity="error">
              {t(
                'You cannot select fields because the selected schema is empty or corrupted.',
              )}
            </Alert>
          );
        }

        return (
          <FieldSelector
            schema={fieldSelection}
            onChange={(newValue) => {
              updateParam({ ...value, [schemaId]: newValue }, paramIdx);
            }}
          />
        );
      }
      default:
        return null;
    }
  };

  const hasFieldSelector = parameters.some(
    ({ type }) => type === PARAMETER_TYPES.FIELD_SELECTOR,
  );

  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle>{t('Algorithm parameters')}</DialogTitle>
      <Container className={classes.content}>
        <Grid container direction="column" spacing={2}>
          {hasFieldSelector && schemas.size > 1 && (
            <Grid item>
              <FormControl>
                <InputLabel>{t('Schema')}</InputLabel>
                <Select
                  value={schemaId}
                  onChange={(event) => {
                    setSchemaId(event.target.value);
                  }}
                >
                  {schemas.entrySeq().map(([id, { label }]) => (
                    <MenuItem value={id} key={label}>
                      {label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          )}
          {parameters.map((param, paramIdx) => {
            const { name, description } = param;
            return (
              // eslint-disable-next-line react/no-array-index-key
              <Grid item key={name}>
                <Typography variant="subtitle1">{name}</Typography>
                <Typography variant="caption">{description}</Typography>
                {renderParam(param, paramIdx)}
              </Grid>
            );
          })}
          <Grid item container justify="space-between">
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                startIcon={<SaveIcon />}
                onClick={() => {
                  parametersOnChange(parameters);
                  schemaOnChange(schemaId);
                  handleClose();
                }}
                id={SET_PARAMETERS_SAVE_BUTTON_ID}
              >
                {t('Save')}
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                startIcon={<ArrowBackIcon />}
                onClick={() => {
                  setParameters(parametersSource);
                  setSchemaId(schemaIdSource);
                  handleClose();
                }}
                id={SET_PARAMETERS_BACK_BUTTON_ID}
              >
                {t('Back')}
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Dialog>
  );
};

SetParametersFormModal.propTypes = {
  parameters: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
        PropTypes.shape({}),
      ]).isRequired,
      description: PropTypes.string.isRequired,
    }),
  ).isRequired,
  t: PropTypes.func.isRequired,
  parametersOnChange: PropTypes.func,
  schemaOnChange: PropTypes.func,
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  schemas: PropTypes.instanceOf(Map).isRequired,
  schemaId: PropTypes.string.isRequired,
};

SetParametersFormModal.defaultProps = {
  parametersOnChange: () => {},
  schemaOnChange: () => {},
};

const mapStateToProps = ({ schema }) => ({
  schemas: schema.getIn(['schemas']),
});

const ConnectedComponent = connect(mapStateToProps)(SetParametersFormModal);

export default withTranslation()(ConnectedComponent);
