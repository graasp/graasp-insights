import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { withTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import Tooltip from '@material-ui/core/Tooltip';
import { SCHEMA_TYPES } from '../../shared/constants';
import {
  SCHEMA_LABELS,
  SCHEMA_COLORS,
  SCHEMA_TOOLTIPS,
} from '../../config/constants';

const styles = () => ({
  chip: {
    height: '20px',
  },
});

const SchemaTag = ({ schemaType, className, t, classes }) => {
  if (schemaType === SCHEMA_TYPES.NONE) {
    return null;
  }

  return (
    <Tooltip title={t(SCHEMA_TOOLTIPS[schemaType])}>
      <Chip
        size="small"
        label={SCHEMA_LABELS[schemaType]}
        style={SCHEMA_COLORS[schemaType]}
        className={clsx(classes.chip, className)}
      />
    </Tooltip>
  );
};

SchemaTag.propTypes = {
  schemaType: PropTypes.string,
  t: PropTypes.func.isRequired,
  className: PropTypes.string,
  classes: PropTypes.shape({
    chip: PropTypes.string.isRequired,
  }).isRequired,
};

SchemaTag.defaultProps = {
  schemaType: SCHEMA_TYPES.NONE,
  className: undefined,
};

const StyledComponent = withStyles(styles)(SchemaTag);

export default withTranslation()(StyledComponent);
