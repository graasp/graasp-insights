import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { SET_PARAMETERS_BUTTON_ID } from '../../config/selectors';
import SetParametersFormModal from './SetParametersFormModal';

const useStyles = makeStyles((theme) => ({
  button: {
    backgroundColor: theme.palette.forestgreen,
    color: 'white',
    '&:hover': {
      backgroundColor: theme.palette.forestgreen,
    },
  },
}));

const SetParametersFormButton = (props) => {
  const [open, setOpen] = useState(false);
  const {
    parameters,
    parametersOnChange,
    schemaOnChange,
    id,
    className,
    schemaId,
  } = props;
  const { t } = useTranslation();
  const classes = useStyles();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div id={id} className={className}>
      <Button
        className={classes.button}
        variant="contained"
        size="small"
        onClick={handleClickOpen}
        id={SET_PARAMETERS_BUTTON_ID}
      >
        {t('Edit parameters')}
      </Button>
      <SetParametersFormModal
        open={open}
        handleClose={handleClose}
        parameters={parameters}
        parametersOnChange={parametersOnChange}
        schemaOnChange={schemaOnChange}
        schemaId={schemaId}
      />
    </div>
  );
};

SetParametersFormButton.propTypes = {
  parameters: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
        PropTypes.shape({}),
      ]).isRequired,
    }),
  ).isRequired,
  parametersOnChange: PropTypes.func,
  schemaOnChange: PropTypes.func,
  className: PropTypes.string,
  id: PropTypes.string,
  schemaId: PropTypes.string.isRequired,
};

SetParametersFormButton.defaultProps = {
  parametersOnChange: () => {},
  schemaOnChange: () => {},
  className: null,
  id: null,
};

export default SetParametersFormButton;
