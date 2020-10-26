import React, { Component } from 'react';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Alert from '@material-ui/lab/Alert';
import Container from '@material-ui/core/Container';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import Button from '@material-ui/core/Button';
import { withTranslation } from 'react-i18next';
import JSONFileEditor from '../common/JSONFileEditor';
import Main from '../common/Main';
import { getDataset } from '../../actions';
import DatasetInformationTable from './DatasetInformationTable';
import Loader from '../common/Loader';
import {
  DATASET_BACK_BUTTON_ID,
  DATASET_NAME_ID,
} from '../../config/selectors';

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
    match: PropTypes.shape({
      params: PropTypes.shape({ id: PropTypes.string }).isRequired,
    }).isRequired,
    dispatchGetDataset: PropTypes.func.isRequired,
    history: PropTypes.shape({
      goBack: PropTypes.func.isRequired,
    }).isRequired,
    t: PropTypes.func.isRequired,
    classes: PropTypes.shape({
      wrapper: PropTypes.string.isRequired,
      infoAlert: PropTypes.string.isRequired,
      backButton: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
    }).isRequired,
    datasetName: PropTypes.string,
    datasetId: PropTypes.string,
    datasetContent: PropTypes.string,
    datasetSize: PropTypes.number,
    activity: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    datasetName: null,
    datasetId: null,
    datasetContent: null,
    datasetSize: null,
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

  renderBackButton = ({ className } = {}) => {
    const { t } = this.props;
    return (
      <Button
        id={DATASET_BACK_BUTTON_ID}
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
    const {
      t,
      classes,
      datasetName,
      datasetSize,
      datasetId,
      datasetContent,
      activity,
    } = this.props;

    if (activity) {
      return (
        <Main fullScreen>
          <Loader />
        </Main>
      );
    }

    if (!datasetId) {
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
              <Typography
                id={DATASET_NAME_ID}
                className={classes.title}
                variant="h4"
                align="center"
              >
                {datasetName}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="h5">{t('Content')}</Typography>
              <JSONFileEditor
                size={datasetSize}
                id={datasetId}
                content={datasetContent}
                collapsed={2}
                editEnabled
              />
            </Grid>
            <Grid item>
              <Typography variant="h5">{t('Information')}</Typography>
              <DatasetInformationTable
                content={datasetContent}
                id={datasetId}
              />
            </Grid>
          </Grid>
        </div>
      </Main>
    );
  }
}

const mapStateToProps = ({ dataset }) => ({
  datasetName: dataset.getIn(['current', 'content', 'name']),
  datasetId: dataset.getIn(['current', 'content', 'id']),
  datasetContent: dataset.getIn(['current', 'content', 'content']),
  datasetSize: dataset.getIn(['current', 'content', 'size']),
  activity: Boolean(dataset.getIn(['activity']).size),
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
