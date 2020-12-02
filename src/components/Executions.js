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
import { DRAWER_HEADER_HEIGHT } from '../config/constants';

const styles = (theme) => ({
  container: {
    margin: theme.spacing(2),
  },
  pythonLogo: {
    position: 'absolute',
    right: 0,
    top: DRAWER_HEADER_HEIGHT + 20,
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
  };

  render() {
    const { classes } = this.props;

    return (
      <Main id={EXECUTIONS_MAIN_ID}>
        <div className={classes.pythonLogo}>
          <PythonLogo />
        </div>
        <AddExecutionForm />
        <div className={classes.container}>
          <ExecutionTable />
        </div>
      </Main>
    );
  }
}
const StyledComponent = withStyles(styles, { withTheme: true })(Executions);

const TranslatedComponent = withTranslation()(StyledComponent);
export default withRouter(TranslatedComponent);
