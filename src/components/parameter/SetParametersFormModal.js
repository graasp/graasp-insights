import React from 'react';
import { makeStyles } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { List } from 'immutable';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { SCHEMA_LABELS } from '../../config/constants';
import { PARAMETER_TYPES } from '../../shared/constants';
import { generateFieldSelector } from '../../shared/utils';
import { isParameterValid } from '../../utils/parameter';
import FieldSelector from './FieldSelector';

const useStyles = makeStyles((theme) => ({
  content: {
    paddingBottom: theme.spacing(2),
  },
}));

const SetParametersFormModal = (props) => {
  const {
    t,
    parameters,
    onChange,
    open,
    handleClose,
    schemas,
    schemaType,
  } = props;
  const classes = useStyles();

  const updateParam = (newValue, paramIdx) => {
    const updatedParam = { ...parameters[paramIdx], value: newValue };

    // replace the param at the right index with the updated one
    const updatedParameters = parameters.slice();
    updatedParameters.splice(paramIdx, 1, updatedParam);

    onChange({ parameters: updatedParameters });
  };

  const renderParam = (param, paramIdx) => {
    const { type: paramType, value } = param;
    const invalid = !isParameterValid(param);
    switch (paramType) {
      case PARAMETER_TYPES.STRING_INPUT: {
        return (
          <TextField
            variant="outlined"
            size="small"
            value={value}
            onChange={(event) => updateParam(event.target.value, paramIdx)}
            fullWidth
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
            fullWidth
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
            fullWidth
          />
        );
      }
      case PARAMETER_TYPES.FIELD_SELECTOR: {
        let fieldSelection;
        if (schemaType in value) {
          fieldSelection = value[schemaType];
        } else {
          const schema = schemas.find(({ type }) => type === schemaType);
          fieldSelection = generateFieldSelector(schema);
        }

        return (
          <FieldSelector
            schema={fieldSelection}
            onChange={(newValue) => {
              updateParam({ ...value, [schemaType]: newValue }, paramIdx);
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
          {hasFieldSelector && (
            <Grid item>
              <FormControl>
                <InputLabel>{t('Schema')}</InputLabel>
                <Select
                  value={schemaType}
                  onChange={(event) => {
                    onChange({ schema: event.target.value });
                  }}
                >
                  {schemas.map(({ type }) => (
                    <MenuItem value={type} key={type}>
                      {SCHEMA_LABELS[type]}
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
      // eslint-disable-next-line react/forbid-prop-types
      value: PropTypes.any.isRequired,
    }),
  ).isRequired,
  t: PropTypes.func.isRequired,
  onChange: PropTypes.func,
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  schemas: PropTypes.instanceOf(List).isRequired,
  schemaType: PropTypes.string.isRequired,
};

SetParametersFormModal.defaultProps = {
  onChange: () => {},
};

const mapStateToProps = ({ schema }) => ({
  schemas: schema.getIn(['schemas']),
});

const ConnectedComponent = connect(mapStateToProps)(SetParametersFormModal);

export default withTranslation()(ConnectedComponent);
