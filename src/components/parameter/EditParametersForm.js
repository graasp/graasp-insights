import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import Select from '@material-ui/core/Select';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import { Alert } from '@material-ui/lab';
import { Map } from 'immutable';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { PARAMETER_TYPES_DEFAULT } from '../../config/constants';
import {
  PARAMETER_CLASS,
  PARAMETER_NAME_CLASS,
  PARAMETER_TYPE_CLASS,
  PARAMETER_DESCRIPTION_CLASS,
  PARAMETER_VALUE_CLASS,
  ADD_PARAMETER_BUTTON_ID,
  buildParameterTypeOptionClass,
} from '../../config/selectors';
import { PARAMETER_TYPES, GRAASP_SCHEMA_ID } from '../../shared/constants';
import { generateFieldSelector } from '../../shared/utils';
import {
  areParametersNamesUnique,
  isParameterNameValid,
  isParameterValid,
} from '../../utils/parameter';
import FieldSelector from './FieldSelector';

const useStyles = makeStyles((theme) => ({
  parametersContent: {
    padding: theme.spacing(1),
  },
  addParameterButton: {
    color: 'white',
    backgroundColor: theme.palette.forestgreen,
    '&:hover': {
      backgroundColor: theme.palette.forestgreen,
    },
  },
  fieldSelectorMargin: {
    margin: theme.spacing(1),
  },
  alertError: {
    marginBottom: theme.spacing(1),
  },
}));

const EditParametersForm = (props) => {
  const { t, parameters, onChange, id, className, schemas } = props;
  const classes = useStyles();
  const [schemaId, setSchemaId] = useState(GRAASP_SCHEMA_ID);

  const updateParam = (updatedParam, paramIdx) => {
    // replace the param at the right index with the updated one
    const updatedParameters = parameters.slice();
    updatedParameters.splice(paramIdx, 1, updatedParam);

    onChange(updatedParameters);
  };

  const deleteParam = (paramIdx) => {
    const updatedParameters = parameters.slice();
    updatedParameters.splice(paramIdx, 1);

    onChange(updatedParameters);
  };

  const addParam = () => {
    const newParam = {
      name: '',
      type: PARAMETER_TYPES.INTEGER_INPUT,
      value: PARAMETER_TYPES_DEFAULT[PARAMETER_TYPES.INTEGER_INPUT],
    };

    onChange([...parameters, newParam]);
  };

  const updateDescription = (description, paramIdx) => {
    updateParam({ ...parameters[paramIdx], description }, paramIdx);
  };

  const updateName = (name, paramIdx) => {
    updateParam({ ...parameters[paramIdx], name }, paramIdx);
  };

  const updateType = (type, paramIdx) => {
    updateParam(
      {
        ...parameters[paramIdx],
        type,
        value: PARAMETER_TYPES_DEFAULT[type],
      },
      paramIdx,
    );
  };

  const updateValue = (value, paramIdx) => {
    updateParam({ ...parameters[paramIdx], value }, paramIdx);
  };

  const renderParam = (param, paramIdx) => {
    const { type: paramType, value } = param;
    const invalid = !isParameterValid(param);
    switch (paramType) {
      case PARAMETER_TYPES.STRING_INPUT: {
        return (
          <TextField
            label={t('Default value')}
            size="small"
            fullWidth
            value={value}
            onChange={(event) => updateValue(event.target.value, paramIdx)}
            inputProps={{ className: PARAMETER_VALUE_CLASS }}
          />
        );
      }
      case PARAMETER_TYPES.INTEGER_INPUT: {
        return (
          <TextField
            label={t('Default value')}
            size="small"
            fullWidth
            value={value}
            onChange={(event) => updateValue(event.target.value, paramIdx)}
            error={invalid}
            helperText={invalid && t('Please provide an integer')}
            inputProps={{ className: PARAMETER_VALUE_CLASS }}
          />
        );
      }
      case PARAMETER_TYPES.FLOAT_INPUT: {
        return (
          <TextField
            label={t('Default value')}
            size="small"
            fullWidth
            value={value}
            onChange={(event) => updateValue(event.target.value, paramIdx)}
            error={invalid}
            helperText={invalid && t('Please provide a number')}
            inputProps={{ className: PARAMETER_VALUE_CLASS }}
          />
        );
      }
      case PARAMETER_TYPES.FIELD_SELECTOR: {
        let fieldSelection;
        if (schemaId in value) {
          fieldSelection = value[schemaId];
        } else {
          const schema = schemas.get(schemaId)?.schema;
          fieldSelection = generateFieldSelector(schema);
        }

        return (
          <FieldSelector
            schema={fieldSelection}
            onChange={(newValue) => {
              updateValue({ ...value, [schemaId]: newValue }, paramIdx);
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
    <div id={id} className={className}>
      <Typography variant="h6">{t('Parameters')}</Typography>
      <Grid container direction="column" spacing={1}>
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
                {schemas.entrySeq().map(([sid, { label }]) => (
                  <MenuItem value={sid} key={label}>
                    {label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        )}
        {parameters?.map((param, paramIdx) => {
          const { name, type, description } = param;
          const invalidName = name.length > 0 && !isParameterNameValid(param);
          return (
            // eslint-disable-next-line react/no-array-index-key
            <Grid item key={paramIdx} className={PARAMETER_CLASS}>
              <Paper className={classes.parametersContent}>
                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <TextField
                      label={t('Name')}
                      fullWidth
                      value={name}
                      onChange={(event) => {
                        updateName(event.target.value, paramIdx);
                      }}
                      error={invalidName}
                      helperText={
                        invalidName &&
                        t(
                          "Parameter name can only contain letters, digits and '_' and can't start with a digit",
                        )
                      }
                      inputProps={{ className: PARAMETER_NAME_CLASS }}
                    />
                  </Grid>
                  <Grid item xs={5}>
                    <FormControl fullWidth>
                      <InputLabel>{t('Type')}</InputLabel>
                      <Select
                        value={type}
                        onChange={(event) => {
                          updateType(event.target.value, paramIdx);
                        }}
                        className={PARAMETER_TYPE_CLASS}
                      >
                        {Object.values(PARAMETER_TYPES).map(
                          (paramType, idx) => (
                            <MenuItem
                              value={paramType}
                              // eslint-disable-next-line react/no-array-index-key
                              key={idx}
                              className={buildParameterTypeOptionClass(
                                paramType,
                              )}
                            >
                              {t(paramType)}
                            </MenuItem>
                          ),
                        )}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={1}>
                    <Tooltip title={t('Remove parameter')}>
                      <IconButton
                        size="small"
                        onClick={() => deleteParam(paramIdx)}
                      >
                        <RemoveCircleOutlineIcon />
                      </IconButton>
                    </Tooltip>
                  </Grid>
                </Grid>
                <Grid container spacing={1}>
                  <Grid
                    item
                    xs={type === PARAMETER_TYPES.FIELD_SELECTOR ? 12 : 8}
                  >
                    <TextField
                      label={t('Description')}
                      value={description}
                      fullWidth
                      size="small"
                      multiline
                      rowsMax={4}
                      onChange={(event) => {
                        updateDescription(event.target.value, paramIdx);
                      }}
                      inputProps={{ className: PARAMETER_DESCRIPTION_CLASS }}
                    />
                  </Grid>
                  <Grid
                    item
                    xs={type === PARAMETER_TYPES.FIELD_SELECTOR ? 12 : 4}
                  >
                    {renderParam(param, paramIdx)}
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          );
        })}
        {(parameters.some(({ name }) => name.length === 0) && (
          <Grid item>
            <Alert severity="error">
              {t("Parameter names can't be empty")}
            </Alert>
          </Grid>
        )) ||
          (!areParametersNamesUnique(parameters) && (
            <Grid item>
              <Alert severity="error">
                {t("Parameters can't have the same name")}
              </Alert>
            </Grid>
          ))}
        <Grid item>
          <Button
            className={classes.addParameterButton}
            variant="contained"
            size="small"
            onClick={() => {
              addParam();
            }}
            id={ADD_PARAMETER_BUTTON_ID}
          >
            {t('Add parameter')}
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

EditParametersForm.propTypes = {
  t: PropTypes.func.isRequired,
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
  onChange: PropTypes.func,
  id: PropTypes.string,
  className: PropTypes.string,
  schemas: PropTypes.instanceOf(Map).isRequired,
};

EditParametersForm.defaultProps = {
  onChange: () => {},
  id: null,
  className: null,
};

const mapStateToProps = ({ schema }) => ({
  schemas: schema.getIn(['schemas']),
});

const ConnectedComponent = connect(mapStateToProps)(EditParametersForm);

export default withTranslation()(ConnectedComponent);
