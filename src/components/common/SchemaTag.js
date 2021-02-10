import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import Chip from '@material-ui/core/Chip';
import Tooltip from '@material-ui/core/Tooltip';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  clickable: {
    cursor: 'pointer',
  },
}));

const SchemaTag = ({ schema, className, size, tooltip, onClick }) => {
  const classes = useStyles();

  if (!schema) {
    return null;
  }

  const { label, tagStyle } = schema;
  const chip = (
    <Chip
      size={size}
      label={label}
      style={tagStyle}
      className={clsx(className, onClick && classes.clickable)}
      onClick={onClick}
    />
  );

  return tooltip ? <Tooltip title={tooltip}>{chip}</Tooltip> : chip;
};

SchemaTag.propTypes = {
  schema: PropTypes.shape({
    label: PropTypes.string.isRequired,
    tagStyle: PropTypes.shape({}).isRequired,
  }),
  className: PropTypes.string,
  size: PropTypes.string,
  tooltip: PropTypes.string,
  onClick: PropTypes.func,
};

SchemaTag.defaultProps = {
  schema: null,
  className: null,
  size: 'small',
  tooltip: null,
  onClick: null,
};

export default SchemaTag;
