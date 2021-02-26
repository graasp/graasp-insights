import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Alert from '@material-ui/lab/Alert';
import { openPath } from '../../actions/path';

const styles = (theme) => ({
  folderString: {
    display: 'inline',
    margin: 0,
    textTransform: 'none',
    fontFamily: 'courier new',
    padding: theme.spacing(0, 1),
  },
  infoAlert: {
    margin: theme.spacing(2),
  },
});

// eslint-disable-next-line react/prefer-stateless-function
class LocationPathAlert extends Component {
  static propTypes = {
    classes: PropTypes.shape({
      infoAlert: PropTypes.string.isRequired,
      folderString: PropTypes.string,
    }).isRequired,
    path: PropTypes.string,
    text: PropTypes.string,
  };

  static defaultProps = {
    path: null,
    text: 'The following data are saved in your computer at',
  };

  render() {
    const { classes, path, text } = this.props;

    return (
      <Alert severity="info" className={classes.infoAlert}>
        {text}
        <Button onClick={() => openPath(path)} className={classes.folderString}>
          {path}
        </Button>
      </Alert>
    );
  }
}

const StyledComponent = withStyles(styles, { withTheme: true })(
  LocationPathAlert,
);

export default withRouter(StyledComponent);
