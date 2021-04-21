import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Tooltip from '@material-ui/core/Tooltip';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import SuccessIcon from '@material-ui/icons/Done';
import ErrorIcon from '@material-ui/icons/Clear';
import PropTypes from 'prop-types';
import { EXECUTION_STATUSES } from '../../shared/constants';
import { CIRCLE_PROGRESS_SIZE } from '../../config/constants';

const ExecutionStatusIcon = ({ status, className }) => {
  const { t } = useTranslation();

  switch (status) {
    case EXECUTION_STATUSES.SUCCESS:
      return (
        <Tooltip title={t('Execution successful')}>
          <SuccessIcon
            className={clsx(status, className)}
            style={{ color: 'green' }}
          />
        </Tooltip>
      );
    case EXECUTION_STATUSES.ERROR:
      return (
        <Tooltip title={t('An error occurred during execution')}>
          <ErrorIcon
            className={clsx(status, className)}
            style={{ color: 'red' }}
          />
        </Tooltip>
      );
    case EXECUTION_STATUSES.RUNNING:
      return (
        <Tooltip title={t('Execution running...')}>
          <CircularProgress
            className={clsx(status, className)}
            size={CIRCLE_PROGRESS_SIZE}
          />
        </Tooltip>
      );
    default:
      return null;
  }
};

ExecutionStatusIcon.propTypes = {
  className: PropTypes.string,
  status: PropTypes.oneOf(Object.values(EXECUTION_STATUSES)).isRequired,
};

ExecutionStatusIcon.defaultProps = {
  className: '',
};

export default ExecutionStatusIcon;
