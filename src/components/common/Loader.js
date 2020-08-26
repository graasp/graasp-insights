import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ReactLoading from 'react-loading';

const Loader = ({ type, theme }) => (
  <div className="Loader">
    <ReactLoading type={type} color={theme.palette.primary.main} />
  </div>
);

Loader.propTypes = {
  type: PropTypes.string,
  theme: PropTypes.shape({
    palette: PropTypes.shape({
      primary: PropTypes.shape({
        main: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  }).isRequired,
};

Loader.defaultProps = {
  type: 'bubbles',
};

const StyledComponent = withStyles(null, { withTheme: true })(Loader);

export default StyledComponent;
