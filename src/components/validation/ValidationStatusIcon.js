import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import FailIcon from '@material-ui/icons/Close';
import SuccessIcon from '@material-ui/icons/Done';
import WarningIcon from '@material-ui/icons/Warning';
import ErrorIcon from '@material-ui/icons/Error';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { CIRCLE_PROGRESS_SIZE } from '../../config/constants';
import {
  EXECUTION_STATUSES,
  VALIDATION_STATUSES,
} from '../../shared/constants';

const LightTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: theme.palette.common.white,
    color: 'rgba(0, 0, 0, 0.87)',
    boxShadow: theme.shadows[1],
    fontSize: 11,
  },
}))(Tooltip);

const ValidationStatusIcon = ({ status, outcome, info, className }) => {
  const { t } = useTranslation();

  let statusIcon;
  let tooltip;
  if (status === EXECUTION_STATUSES.SUCCESS) {
    tooltip = info;
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
        return null;
    }
  } else {
    switch (status) {
      case EXECUTION_STATUSES.ERROR:
        tooltip = t('An error occurred during validation');
        statusIcon = (
          <ErrorIcon
            className={clsx(status, className)}
            style={{ color: 'red' }}
          />
        );
        break;
      case EXECUTION_STATUSES.RUNNING:
        tooltip = t('Validation running...');
        statusIcon = (
          <CircularProgress
            className={clsx(status, className)}
            size={CIRCLE_PROGRESS_SIZE}
          />
        );
        break;
      default:
        return null;
    }
  }

  return tooltip ? (
    <LightTooltip title={<pre>{tooltip}</pre>}>{statusIcon}</LightTooltip>
  ) : (
    statusIcon
  );
};

ValidationStatusIcon.propTypes = {
  className: PropTypes.string,
  status: PropTypes.objectOf(Object.values(EXECUTION_STATUSES)),
  outcome: PropTypes.oneOf(Object.values(VALIDATION_STATUSES)),
  info: PropTypes.string,
};

ValidationStatusIcon.defaultProps = {
  className: '',
  info: '',
  status: null,
  outcome: null,
};

export default ValidationStatusIcon;
