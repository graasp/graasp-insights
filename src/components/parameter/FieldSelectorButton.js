import Button from '@material-ui/core/Button';
import CodeIcon from '@material-ui/icons/Code';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import FieldSelectorModal from './FieldSelectorModal';

const FieldSelectorButton = (props) => {
  const [open, setOpen] = useState(false);
  const { param, onChange, id, className } = props;

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div style={{ display: 'inline-block' }} id={id} className={className}>
      <Button
        color="primary"
        variant="contained"
        size="small"
        onClick={handleClickOpen}
      >
        <CodeIcon color="secondary" />
      </Button>
      <FieldSelectorModal
        open={open}
        handleClose={handleClose}
        param={param}
        onChange={onChange}
      />
    </div>
  );
};

FieldSelectorButton.propTypes = {
  param: PropTypes.shape({}).isRequired,
  onChange: PropTypes.func,
  className: PropTypes.string,
  id: PropTypes.string,
};

FieldSelectorButton.defaultProps = {
  onChange: () => {},
  className: undefined,
  id: undefined,
};

export default FieldSelectorButton;
