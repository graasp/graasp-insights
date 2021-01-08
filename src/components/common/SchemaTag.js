import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { withTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import Tooltip from '@material-ui/core/Tooltip';

const styles = () => ({
  chip: {
    height: '20px',
  },
});

const SchemaTag = ({ schema, className, t, classes }) => {
  if (!schema) {
    return null;
  }

  const { label, tagStyle } = schema;

  return (
    <Tooltip title={`${t('Detected schema')}: ${label}`}>
      <Chip
        size="small"
        label={label}
        style={tagStyle}
        className={clsx(classes.chip, className)}
      />
    </Tooltip>
  );
};

SchemaTag.propTypes = {
  schema: PropTypes.shape({
    schemaId: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    tagStyle: PropTypes.shape({}).isRequired,
  }),
  t: PropTypes.func.isRequired,
  className: PropTypes.string,
  classes: PropTypes.shape({
    chip: PropTypes.string.isRequired,
  }).isRequired,
};

SchemaTag.defaultProps = {
  schema: null,
  className: null,
};

const StyledComponent = withStyles(styles)(SchemaTag);

export default withTranslation()(StyledComponent);
