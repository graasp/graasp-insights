import React from 'react';
import PropTypes from 'prop-types';
import Tooltip from '@material-ui/core/Tooltip';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { withTranslation } from 'react-i18next';

const styles = (theme) => ({
  pythonLogo: {
    display: 'inside-block',
    width: '22px',
  },
  valid: {
    fill: theme.palette.primary.main,
  },
  invalid: {
    fill: 'gray',
  },
});

const PythonLogo = ({ t, pythonVersion, classes }) => {
  if (!pythonVersion) return null;

  const { valid, version } = pythonVersion;

  return (
    <Tooltip
      title={`Python (${
        version ? `${t('version')} ${version}` : t('not installed')
      })`}
    >
      <div className={classes.pythonLogo}>
        <svg
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 40 40"
        >
          <rect
            x="10"
            y="0"
            width="20"
            height="40"
            rx="10"
            ry="5"
            className={valid ? classes.valid : classes.invalid}
          />
          <rect
            x="0"
            y="10"
            width="40"
            height="20"
            rx="5"
            ry="10"
            className={valid ? classes.valid : classes.invalid}
          />
          <circle cx="14.5" cy="5" r="1.85" fill="white" />
          <circle cx="25.5" cy="35" r="1.85" fill="white" />
          <line x1="10" y1="9.5" x2="20" y2="9.5" stroke="white" />
          <line x1="20" y1="30.5" x2="30" y2="30.5" stroke="white" />
          <path
            d="m 9.5,30 c 0,-10 2.5,-10 10,-10 8.5,0 11,0 11,-10"
            stroke="white"
            fill="none"
          />
        </svg>
      </div>
    </Tooltip>
  );
};

PythonLogo.propTypes = {
  t: PropTypes.func.isRequired,
  pythonVersion: PropTypes.shape({
    version: PropTypes.string,
    valid: PropTypes.bool,
  }).isRequired,
  classes: PropTypes.shape({
    pythonLogo: PropTypes.string.isRequired,
    valid: PropTypes.string.isRequired,
    invalid: PropTypes.string.isRequired,
  }).isRequired,
};

const mapStateToProps = ({ settings }) => ({
  pythonVersion: settings.get('pythonVersion'),
});

const ConnectedComponent = connect(mapStateToProps)(PythonLogo);

const StyledComponent = withStyles(styles, { withTheme: true })(
  ConnectedComponent,
);

export default withTranslation()(StyledComponent);
