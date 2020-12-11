import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import SetParametersFormModal from './SetParametersFormModal';

const SetParametersFormButton = (props) => {
  const [open, setOpen] = useState(false);
  const { parameters, onChange, id, className, schemaType } = props;
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
      >
        {t('Edit parameters')}
      </Button>
      <SetParametersFormModal
        open={open}
        handleClose={handleClose}
        parameters={parameters}
        onChange={onChange}
        schemaType={schemaType}
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
  onChange: PropTypes.func,
  className: PropTypes.string,
  id: PropTypes.string,
  schemaType: PropTypes.string.isRequired,
};

SetParametersFormButton.defaultProps = {
  onChange: () => {},
  className: undefined,
  id: undefined,
};

export default SetParametersFormButton;
