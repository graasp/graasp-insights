import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import PropTypes from 'prop-types';
import React from 'react';
import { withTranslation } from 'react-i18next';
import {
  DEFAULT_PARAMETER_NAME,
  PARAMETER_TYPES_DEFAULT,
} from '../../config/constants';
import { PARAMETER_TYPES } from '../../shared/constants';
import { isParameterValid } from '../../utils/parameter';
import FieldSelectorButton from './FieldSelectorButton';

const useStyles = makeStyles((theme) => ({
  parametersContent: {
    padding: theme.spacing(1),
  },
  addParameterButton: {
    marginTop: theme.spacing(1),
  },
  parameterTopMargin: {
    marginTop: theme.spacing(2),
  },
}));

const EditParameters = (props) => {
  const { t, parameters, onChange, id, className } = props;
  const classes = useStyles();

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
      name: DEFAULT_PARAMETER_NAME,
      type: PARAMETER_TYPES.INTEGER_INPUT,
      value: PARAMETER_TYPES_DEFAULT[PARAMETER_TYPES.INTEGER_INPUT],
    };

    onChange([...parameters, newParam]);
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
    const { type, value } = param;
    const invalid = !isParameterValid(param);
    switch (type) {
      case PARAMETER_TYPES.STRING_INPUT: {
        return (
          <TextField
            value={value}
            onChange={(event) => updateValue(event.target.value, paramIdx)}
            label={t('Default value')}
          />
        );
      }
      case PARAMETER_TYPES.INTEGER_INPUT: {
        return (
          <TextField
            value={value}
            onChange={(event) => updateValue(event.target.value, paramIdx)}
            error={invalid}
            helperText={invalid && t('Please provide an integer')}
            label={t('Default value')}
          />
        );
      }
      case PARAMETER_TYPES.NUMBER_INPUT: {
        return (
          <TextField
            value={value}
            onChange={(event) => updateValue(event.target.value, paramIdx)}
            error={invalid}
            helperText={invalid && t('Please provide a number')}
            label={t('Default value')}
          />
        );
      }
      case PARAMETER_TYPES.FIELD_SELECTOR:
        return (
          <FieldSelectorButton
            param={param}
            onChange={(newValue) => updateValue(newValue, paramIdx)}
            className={classes.parameterTopMargin}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div id={id} className={className}>
      <Typography variant="h6">{t('Parameters')}</Typography>
      <div className={classes.parametersContent}>
        {parameters?.map((param, paramIdx) => {
          const { name, type } = param;
          return (
            // eslint-disable-next-line react/no-array-index-key
            <Grid container spacing={1} key={paramIdx}>
              <Grid item xs={4}>
                <TextField
                  label={t('Name')}
                  value={name}
                  onChange={(event) => updateName(event.target.value, paramIdx)}
                />
              </Grid>
              <Grid item xs={3}>
                <FormControl fullWidth>
                  <InputLabel>{t('Type')}</InputLabel>
                  <Select
                    value={type}
                    onChange={(event) => {
                      updateType(event.target.value, paramIdx);
                    }}
                  >
                    <MenuItem value={PARAMETER_TYPES.INTEGER_INPUT}>
                      {t(PARAMETER_TYPES.INTEGER_INPUT)}
                    </MenuItem>
                    <MenuItem value={PARAMETER_TYPES.NUMBER_INPUT}>
                      {t(PARAMETER_TYPES.NUMBER_INPUT)}
                    </MenuItem>
                    <MenuItem value={PARAMETER_TYPES.STRING_INPUT}>
                      {t(PARAMETER_TYPES.STRING_INPUT)}
                    </MenuItem>
                    <MenuItem value={PARAMETER_TYPES.FIELD_SELECTOR}>
                      {t(PARAMETER_TYPES.FIELD_SELECTOR)}
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                {renderParam(param, paramIdx)}
              </Grid>
              <Grid item xs={1}>
                <IconButton
                  size="small"
                  onClick={() => deleteParam(paramIdx)}
                  className={classes.parameterTopMargin}
                >
                  <RemoveCircleOutlineIcon />
                </IconButton>
              </Grid>
            </Grid>
          );
        })}
        <Button
          color="primary"
          variant="contained"
          size="small"
          className={classes.addParameterButton}
          onClick={() => {
            addParam();
          }}
        >
          {t('Add parameter')}
        </Button>
      </div>
    </div>
  );
};

EditParameters.propTypes = {
  t: PropTypes.func.isRequired,
  parameters: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      // eslint-disable-next-line react/forbid-prop-types
      value: PropTypes.any.isRequired,
    }),
  ).isRequired,
  onChange: PropTypes.func,
  id: PropTypes.string,
  className: PropTypes.string,
};

EditParameters.defaultProps = {
  onChange: () => {},
  id: undefined,
  className: undefined,
};

export default withTranslation()(EditParameters);
