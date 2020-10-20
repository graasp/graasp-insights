import React, { Component } from 'react';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { withTranslation } from 'react-i18next';
import Main from './common/Main';
import PythonLogo from './execution/PythonLogo';
import AddExecutionForm from './execution/AddExecutionForm';
import ExecutionTable from './execution/ExecutionTable';
import { EXECUTIONS_MAIN_ID } from '../config/selectors';

const styles = (theme) => ({
  container: {
    width: '50%',
    margin: '0 auto',
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(4),
  },
  pythonLogo: {
    position: 'absolute',
    right: 0,
    marginRight: theme.spacing(2),
  },
  link: {
    textTransform: 'none',
    textAlign: 'left',
  },
});

// eslint-disable-next-line react/prefer-stateless-function
class Executions extends Component {
  static propTypes = {
    classes: PropTypes.shape({
      container: PropTypes.string.isRequired,
      pythonLogo: PropTypes.string.isRequired,
      button: PropTypes.string.isRequired,
      link: PropTypes.string.isRequired,
    }).isRequired,
  };

  render() {
    const { classes } = this.props;

    return (
      <Main id={EXECUTIONS_MAIN_ID}>
        <div className={classes.container}>
          <div className={classes.pythonLogo}>
            <PythonLogo />
          </div>
          <AddExecutionForm />
          <ExecutionTable />
        </div>
      </Main>
    );
  }
}
const StyledComponent = withStyles(styles, { withTheme: true })(Executions);

const TranslatedComponent = withTranslation()(StyledComponent);
export default withRouter(TranslatedComponent);
