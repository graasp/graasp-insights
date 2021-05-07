import React, { Component } from 'react';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Alert from '@material-ui/lab/Alert';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
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
  DATASET_SCREEN_TABLE_VIEW_ID,
} from '../../config/selectors';
import BackButton from '../common/BackButton';
import SchemaTags from '../common/SchemaTags';
import { GRAASP_SCHEMA_ID } from '../../shared/constants';
import { DATASET_CONTENT_VIEW_MODES } from '../../config/constants';
import DatasetTableView from './DatasetTableView';

const styles = (theme) => ({
  wrapper: {
    padding: theme.spacing(2),
    maxWidth: `calc(100vw - ${theme.spacing(4)}px)`,
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
  viewTypeButtons: {
    float: 'right',
    marginBottom: theme.spacing(1),
  },
});

class DatasetScreen extends Component {
  state = {
    viewType: DATASET_CONTENT_VIEW_MODES.RAW,
  };

  static propTypes = {
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
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
      viewTypeButtons: PropTypes.string.isRequired,
    }).isRequired,
    datasetName: PropTypes.string,
    datasetId: PropTypes.string,
    datasetContent: PropTypes.string,
    datasetSize: PropTypes.number,
    datasetSchemaIds: PropTypes.arrayOf(PropTypes.string),
    isTabular: PropTypes.bool,
    activity: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    datasetName: null,
    datasetId: null,
    datasetContent: null,
    datasetSize: null,
    datasetSchemaIds: [],
    isTabular: false,
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

  componentDidUpdate({ isTabular: prevIsTabular }) {
    const { isTabular } = this.props;

    if (isTabular !== prevIsTabular) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        viewType: isTabular
          ? DATASET_CONTENT_VIEW_MODES.TABLE
          : DATASET_CONTENT_VIEW_MODES.RAW,
      });
    }
  }

  componentWillUnmount() {
    const { dispatchClearDataset } = this.props;
    dispatchClearDataset();
  }

  renderViewTypeButtons = () => {
    const { viewType } = this.state;
    const { isTabular } = this.props;

    return (
      <ButtonGroup size="small">
        <Button
          variant={
            viewType === DATASET_CONTENT_VIEW_MODES.RAW
              ? 'outlined'
              : 'contained'
          }
          color="primary"
          onClick={() => {
            this.setState({ viewType: DATASET_CONTENT_VIEW_MODES.RAW });
          }}
        >
          {DATASET_CONTENT_VIEW_MODES.RAW}
        </Button>
        <Button
          variant={
            viewType === DATASET_CONTENT_VIEW_MODES.TABLE
              ? 'outlined'
              : 'contained'
          }
          color="primary"
          onClick={() => {
            this.setState({ viewType: DATASET_CONTENT_VIEW_MODES.TABLE });
          }}
          disabled={!isTabular}
        >
          {DATASET_CONTENT_VIEW_MODES.TABLE}
        </Button>
      </ButtonGroup>
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
      datasetSchemaIds,
      activity,
    } = this.props;

    const { viewType } = this.state;

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

    const isGraasp = datasetSchemaIds.includes(GRAASP_SCHEMA_ID);
    const showTabular = viewType === DATASET_CONTENT_VIEW_MODES.TABLE;

    return (
      <Main id={DATASET_SCREEN_MAIN_ID}>
        <div className={classes.wrapper}>
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
          <Grid container justify="space-evenly">
            <Grid item xs={showTabular && !isGraasp ? 10 : 6}>
              <Grid container alignItems="center" spacing={1}>
                <Grid item>
                  <Typography variant="h5">{t('Content')}</Typography>
                </Grid>
                <SchemaTags schemaIds={datasetSchemaIds} />
                <Grid item xs>
                  <div className={classes.viewTypeButtons}>
                    {this.renderViewTypeButtons()}
                  </div>
                </Grid>
              </Grid>
              <Paper
                className={
                  viewType === DATASET_CONTENT_VIEW_MODES.RAW && classes.content
                }
              >
                {showTabular ? (
                  <DatasetTableView
                    id={DATASET_SCREEN_TABLE_VIEW_ID}
                    content={datasetContent}
                  />
                ) : (
                  <JSONFileEditor
                    size={datasetSize}
                    id={datasetId}
                    content={datasetContent}
                    collapsed={2}
                    editEnabled
                  />
                )}
              </Paper>
            </Grid>
            {isGraasp && (
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

const mapStateToProps = ({ dataset }) => ({
  datasetName: dataset.getIn(['current', 'content', 'name']),
  datasetId: dataset.getIn(['current', 'content', 'id']),
  datasetContent: dataset.getIn(['current', 'content', 'content']),
  datasetSize: dataset.getIn(['current', 'content', 'size']),
  datasetSchemaIds: dataset.getIn(['current', 'content', 'schemaIds']),
  isTabular: dataset.getIn(['current', 'content', 'isTabular']),
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
