import React, { Component } from 'react';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import Alert from '@material-ui/lab/Alert';
import Container from '@material-ui/core/Container';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import { Map } from 'immutable';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import Button from '@material-ui/core/Button';
import { withTranslation } from 'react-i18next';
import JSONFileReader from '../common/JSONFileReader';
import Loader from '../common/Loader';
import Main from '../common/Main';
import { getDataset } from '../../actions';
import {
  DEFAULT_LOCALE_DATE,
  DEFAULT_NUMBER_FORMAT,
} from '../../config/constants';

const styles = (theme) => ({
  wrapper: {
    padding: theme.spacing(2),
  },
  infoAlert: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  backButton: {
    float: 'left',
    position: 'absolute',
  },
  title: {
    marginBottom: theme.spacing(2),
  },
});

class DatasetScreen extends Component {
  static propTypes = {
    dataset: PropTypes.instanceOf(Map),
    match: PropTypes.shape({
      params: PropTypes.shape({ id: PropTypes.string }).isRequired,
    }).isRequired,
    dispatchGetDataset: PropTypes.func.isRequired,
    history: PropTypes.shape({
      goBack: PropTypes.func.isRequired,
    }).isRequired,
    activity: PropTypes.bool.isRequired,
    t: PropTypes.func.isRequired,
    classes: PropTypes.shape({
      wrapper: PropTypes.string.isRequired,
      infoAlert: PropTypes.string.isRequired,
      backButton: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
    }).isRequired,
  };

  static defaultProps = {
    dataset: Map(),
  };

  componentDidMount() {
    const {
      dispatchGetDataset,
      match: {
        params: { id },
      },
    } = this.props;

    dispatchGetDataset({ id });
  }

  handleBack = () => {
    const {
      history: { goBack },
    } = this.props;
    goBack();
  };

  renderDatasetInformation = () => {
    const { dataset, t } = this.props;
    const content = dataset?.get('content') || '';
    const parsedContent = JSON.parse(content)?.data;

    const { actions = [] } = parsedContent;
    const actionCount = actions?.length.toLocaleString(DEFAULT_NUMBER_FORMAT);
    const userCount = parsedContent?.users?.length.toLocaleString(
      DEFAULT_NUMBER_FORMAT,
    );
    const spaceInfo = parsedContent?.metadata?.spaceTree;
    const mainSpace = spaceInfo?.[0];
    const subSpaceCount = spaceInfo?.slice(1).length;
    const spaceName = mainSpace?.name || t('Unknown');
    const spaceId = mainSpace?.id;
    const countriesSet = new Set(
      actions?.map(({ geolocation }) => geolocation?.country),
    );
    const countryCount = [...countriesSet].length.toLocaleString(
      DEFAULT_NUMBER_FORMAT,
    );

    const dateRange =
      actions
        ?.map(({ createdAt }) =>
          new Date(createdAt).toLocaleDateString(DEFAULT_LOCALE_DATE),
        )
        .sort() || [];

    return (
      <TableContainer component={Paper}>
        <Table size="small">
          <TableBody>
            <TableRow key="spaceId">
              <TableCell component="th" scope="row">
                {t('Space ID')}
              </TableCell>
              <TableCell align="right">{spaceId || t('Unknown')}</TableCell>
            </TableRow>
            <TableRow key="spaceName">
              <TableCell component="th" scope="row">
                {t('Space Name')}
              </TableCell>
              <TableCell align="right">{spaceName || t('Unknown')}</TableCell>
            </TableRow>
            <TableRow key="subSpaceCount">
              <TableCell component="th" scope="row">
                {t('Subspace Count')}
              </TableCell>
              <TableCell align="right">{subSpaceCount || 0}</TableCell>
            </TableRow>
            <TableRow key="dateRange">
              <TableCell component="th" scope="row">
                {t('Date Range')}
              </TableCell>
              <TableCell align="right">
                {dateRange.length
                  ? `${dateRange[0]} - ${dateRange[dateRange.length - 1]}`
                  : t('Unknown')}
              </TableCell>
            </TableRow>
            <TableRow key="actionCount">
              <TableCell component="th" scope="row">
                {t('Action Count')}
              </TableCell>
              <TableCell align="right">{actionCount || t('Unknown')}</TableCell>
            </TableRow>
            <TableRow key="userCount">
              <TableCell component="th" scope="row">
                {t('User Count')}
              </TableCell>
              <TableCell align="right">{userCount || t('Unknown')}</TableCell>
            </TableRow>
            <TableRow key="countryCount">
              <TableCell component="th" scope="row">
                {t('Country Count')}
              </TableCell>
              <TableCell align="right">
                {countryCount || t('Unknown')}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  renderBackButton = ({ className } = {}) => {
    const { t } = this.props;
    return (
      <Button
        className={className}
        variant="contained"
        color="primary"
        onClick={this.handleBack}
      >
        {t('Back')}
      </Button>
    );
  };

  render() {
    const { dataset, activity, t, classes } = this.props;

    if (activity) {
      return (
        <Main fullScreen>
          <Loader />
        </Main>
      );
    }
    if (!dataset || dataset.isEmpty()) {
      return (
        <Main>
          <Container>
            <Alert severity="error" className={classes.infoAlert}>
              {t('An unexpected error happened while opening the dataset.')}
            </Alert>
            {this.renderBackButton()}
          </Container>
        </Main>
      );
    }

    return (
      <Main>
        <div className={classes.wrapper}>
          <Grid container>
            <Grid item xs={12}>
              {this.renderBackButton({ className: classes.backButton })}
              <Typography className={classes.title} variant="h4" align="center">
                {dataset.get('name')}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="h5">{t('Content')}</Typography>
              <JSONFileReader
                size={dataset.get('size')}
                content={dataset.get('content')}
                collapsed={2}
              />
            </Grid>
            <Grid item>
              <Typography variant="h5">{t('Information')}</Typography>
              {this.renderDatasetInformation()}
            </Grid>
          </Grid>
        </div>
      </Main>
    );
  }
}

const mapStateToProps = ({ dataset }) => ({
  dataset: dataset.getIn(['current', 'content']),
  activity: Boolean(dataset.getIn(['current', 'activity']).size),
});

const mapDispatchToProps = {
  dispatchGetDataset: getDataset,
};

const ConnectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps,
)(DatasetScreen);

const StyledComponent = withStyles(styles, { withTheme: true })(
  ConnectedComponent,
);

const TranslatedComponent = withTranslation()(StyledComponent);
export default withRouter(TranslatedComponent);
