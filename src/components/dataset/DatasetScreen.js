import React, { Component } from 'react';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Alert from '@material-ui/lab/Alert';
import Container from '@material-ui/core/Container';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import JSONFileEditor from '../common/JSONFileEditor';
import Main from '../common/Main';
import { getDataset, clearDataset } from '../../actions';
import DatasetInformationTable from './DatasetInformationTable';
import Loader from '../common/Loader';
import {
  DATASET_BACK_BUTTON_ID,
  DATASET_NAME_ID,
  DATASET_SCREEN_MAIN_ID,
} from '../../config/selectors';
import BackButton from '../common/BackButton';
import SchemaTag from '../common/SchemaTag';
import { GRAASP_SCHEMA_ID } from '../../shared/constants';

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
  content: {
    padding: theme.spacing(1),
  },
});

class DatasetScreen extends Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({ id: PropTypes.string }).isRequired,
    }).isRequired,
    dispatchGetDataset: PropTypes.func.isRequired,
    dispatchClearDataset: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
    classes: PropTypes.shape({
      wrapper: PropTypes.string.isRequired,
      infoAlert: PropTypes.string.isRequired,
      backButton: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
    }).isRequired,
    datasetName: PropTypes.string,
    datasetId: PropTypes.string,
    datasetContent: PropTypes.string,
    datasetSize: PropTypes.number,
    datasetSchema: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }),
    activity: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    datasetName: null,
    datasetId: null,
    datasetContent: null,
    datasetSize: null,
    datasetSchema: null,
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

  componentWillUnmount() {
    const { dispatchClearDataset } = this.props;
    dispatchClearDataset();
  }

  render() {
    const {
      t,
      classes,
      datasetName,
      datasetSize,
      datasetId,
      datasetContent,
      datasetSchema,
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
            <BackButton id={DATASET_BACK_BUTTON_ID} />
          </Container>
        </Main>
      );
    }

    return (
      <Main id={DATASET_SCREEN_MAIN_ID}>
        <div className={classes.wrapper}>
          <Grid container justify="space-evenly">
            <Grid item xs={12}>
              <BackButton
                id={DATASET_BACK_BUTTON_ID}
                className={classes.backButton}
              />
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
              <Grid container alignItems="center" spacing={2}>
                <Grid item>
                  <Typography variant="h5">{t('Content')}</Typography>
                </Grid>
                {datasetSchema && (
                  <Grid item>
                    <SchemaTag schema={datasetSchema} />
                  </Grid>
                )}
              </Grid>
              <Paper className={classes.content}>
                <JSONFileEditor
                  size={datasetSize}
                  id={datasetId}
                  content={datasetContent}
                  collapsed={2}
                  editEnabled
                />
              </Paper>
            </Grid>
            {datasetSchema?.id === GRAASP_SCHEMA_ID && (
              <Grid item>
                <Typography variant="h5">{t('Information')}</Typography>
                <DatasetInformationTable
                  content={datasetContent}
                  id={datasetId}
                />
              </Grid>
            )}
          </Grid>
        </div>
      </Main>
    );
  }
}

const mapStateToProps = ({ dataset, schema }) => ({
  datasetName: dataset.getIn(['current', 'content', 'name']),
  datasetId: dataset.getIn(['current', 'content', 'id']),
  datasetContent: dataset.getIn(['current', 'content', 'content']),
  datasetSize: dataset.getIn(['current', 'content', 'size']),
  datasetSchema: schema.getIn([
    'schemas',
    dataset.getIn(['current', 'content', 'schemaId']),
  ]),
  activity: Boolean(dataset.getIn(['activity']).size),
});

const mapDispatchToProps = {
  dispatchGetDataset: getDataset,
  dispatchClearDataset: clearDataset,
};

const ConnectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps,
)(DatasetScreen);

const StyledComponent = withStyles(styles, { withTheme: true })(
  ConnectedComponent,
);

const TranslatedComponent = withTranslation()(StyledComponent);
export default TranslatedComponent;
