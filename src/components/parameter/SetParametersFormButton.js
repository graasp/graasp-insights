import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import SetParametersFormModal from './SetParametersFormModal';
import { SET_PARAMETERS_BUTTON_ID } from '../../config/selectors';

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

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div id={id} className={className}>
      <Button
        color="primary"
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
      // eslint-disable-next-line react/forbid-prop-types
      value: PropTypes.any.isRequired,
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
  className: undefined,
  id: undefined,
};

export default SetParametersFormButton;
