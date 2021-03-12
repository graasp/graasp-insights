import React from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { EXECUTION_TABLE_ROW_BUTTON_CLASS } from '../../config/selectors';

const useStyles = makeStyles(() => ({
  link: {
    textTransform: 'none',
    textAlign: 'left',
  },
}));

function LinkButton({ className, onClick, text, disabled }) {
  const classes = useStyles();

  return (
    <Button
      onClick={onClick}
      className={clsx(
        classes.link,
        EXECUTION_TABLE_ROW_BUTTON_CLASS,
        className,
      )}
      disabled={disabled}
    >
      {text}
    </Button>
  );
}

LinkButton.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
};

LinkButton.defaultProps = {
  className: '',
  disabled: false,
};

export default LinkButton;
