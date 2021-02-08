import React from 'react';
import PropTypes from 'prop-types';
import Chip from '@material-ui/core/Chip';
import Tooltip from '@material-ui/core/Tooltip';

const SchemaTag = ({ schema, className, size, tooltip }) => {
  if (!schema) {
    return null;
  }

  const { label, tagStyle } = schema;
  const chip = (
    <Chip size={size} label={label} style={tagStyle} className={className} />
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
};

SchemaTag.defaultProps = {
  schema: null,
  className: null,
  size: 'small',
  tooltip: null,
};

export default SchemaTag;
