import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import FailIcon from '@material-ui/icons/Close';
import SuccessIcon from '@material-ui/icons/Done';
import WarningIcon from '@material-ui/icons/Warning';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { VALIDATION_STATUSES } from '../../shared/constants';

const LightTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: theme.palette.common.white,
    color: 'rgba(0, 0, 0, 0.87)',
    boxShadow: theme.shadows[1],
    fontSize: 11,
  },
}))(Tooltip);

const ValidationStatusIcon = ({ outcome, info, className }) => {
  let statusIcon;
  switch (outcome) {
    case VALIDATION_STATUSES.SUCCESS:
      statusIcon = (
        <SuccessIcon
          className={clsx(outcome, className)}
          style={{ color: 'green' }}
        />
      );
      break;
    case VALIDATION_STATUSES.WARNING:
      statusIcon = (
        <WarningIcon
          className={clsx(outcome, className)}
          style={{ color: 'orange' }}
        />
      );
      break;
    case VALIDATION_STATUSES.FAILURE:
      statusIcon = (
        <FailIcon
          className={clsx(outcome, className)}
          style={{ color: 'red' }}
        />
      );
      break;
    default:
      statusIcon = null;
  }

  return info ? (
    <LightTooltip title={<pre>{info}</pre>}>{statusIcon}</LightTooltip>
  ) : (
    statusIcon
  );
};

ValidationStatusIcon.propTypes = {
  className: PropTypes.string,
  outcome: PropTypes.oneOf(Object.values(VALIDATION_STATUSES)).isRequired,
  info: PropTypes.string,
};

ValidationStatusIcon.defaultProps = {
  className: '',
  info: '',
};

export default ValidationStatusIcon;
