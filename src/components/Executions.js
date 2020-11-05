import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { withTranslation } from 'react-i18next';

import Main from './common/Main';
import PythonLogo from './execution/PythonLogo';
import AddExecutionForm from './execution/AddExecutionForm';

const styles = (theme) => ({
  container: {
    width: '50%',
    margin: '0 auto',
    marginTop: theme.spacing(2),
  },
  pythonLogo: {
    position: 'fixed',
    right: 0,
    marginRight: theme.spacing(2),
  },
});

// eslint-disable-next-line react/prefer-stateless-function
class Executions extends Component {
  static propTypes = {
    classes: PropTypes.shape({
      container: PropTypes.string.isRequired,
      pythonLogo: PropTypes.string.isRequired,
    }).isRequired,
    pythonVersion: PropTypes.shape({
      valid: PropTypes.bool,
      version: PropTypes.string,
    }).isRequired,
  };

  render() {
    const { classes } = this.props;

    return (
      <Main>
        <div className={classes.container}>
          <div className={classes.pythonLogo}>
            <PythonLogo />
          </div>
          <AddExecutionForm />
        </div>
      </Main>
    );
  }
}

const mapStateToProps = ({ dataset, algorithms, settings }) => ({
  datasets: dataset.get('datasets'),
  algorithms: algorithms.get('algorithms'),
  pythonVersion: settings.get('pythonVersion'),
});

const ConnectedComponent = connect(mapStateToProps, null)(Executions);

const StyledComponent = withStyles(styles, { withTheme: true })(
  ConnectedComponent,
);

export default withTranslation()(StyledComponent);
