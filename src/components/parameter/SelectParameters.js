import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import React from 'react';
import { withTranslation } from 'react-i18next';
import { PARAMETER_TYPES } from '../../shared/constants';
import { isParameterValid } from '../../utils/parameter';
import FieldSelectorButton from './FieldSelectorButton';

const useStyles = makeStyles((theme) => ({
  parametersContent: {
    padding: theme.spacing(1),
  },
}));

const SelectParameters = (props) => {
  const { t, parameters, onChange, id, className } = props;
  const classes = useStyles();

  const updateParam = (newValue, paramIdx) => {
    const updatedParam = { ...parameters[paramIdx], value: newValue };

    // replace the param at the right index with the updated one
    const updatedParameters = parameters.slice();
    updatedParameters.splice(paramIdx, 1, updatedParam);

    onChange(updatedParameters);
  };

  const renderParam = (param, paramIdx) => {
    const { type, value } = param;
    const invalid = !isParameterValid(param);
    switch (type) {
      case PARAMETER_TYPES.STRING_INPUT: {
        return (
          <TextField
            value={value}
            onChange={(event) => updateParam(event.target.value, paramIdx)}
          />
        );
      }
      case PARAMETER_TYPES.INTEGER_INPUT: {
        return (
          <TextField
            value={value}
            onChange={(event) => updateParam(event.target.value, paramIdx)}
            error={invalid}
            helperText={invalid && t('Please provide an integer')}
          />
        );
      }
      case PARAMETER_TYPES.FLOAT_INPUT: {
        return (
          <TextField
            value={value}
            onChange={(event) => updateParam(event.target.value, paramIdx)}
            error={invalid}
            helperText={invalid && t('Please provide a number')}
          />
        );
      }
      case PARAMETER_TYPES.FIELD_SELECTOR:
        return (
          <FieldSelectorButton
            param={param}
            onChange={(newValue) => updateParam(newValue, paramIdx)}
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
        <Grid>
          {parameters.map((param, paramIdx) => {
            const { name } = param;
            return (
              // eslint-disable-next-line react/no-array-index-key
              <Grid container alignItems="center" spacing={2} key={paramIdx}>
                <Grid item>
                  <Typography>{`${name}:`}</Typography>
                </Grid>
                <Grid item>{renderParam(param, paramIdx)}</Grid>
              </Grid>
            );
          })}
        </Grid>
      </div>
    </div>
  );
};

SelectParameters.propTypes = {
  parameters: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      // eslint-disable-next-line react/forbid-prop-types
      value: PropTypes.any.isRequired,
    }),
  ).isRequired,
  t: PropTypes.func.isRequired,
  onChange: PropTypes.func,
  id: PropTypes.string,
  className: PropTypes.string,
};

SelectParameters.defaultProps = {
  onChange: () => {},
  id: undefined,
  className: undefined,
};

export default withTranslation()(SelectParameters);
