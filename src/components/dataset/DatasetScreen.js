import React, { Component } from 'react';
import { connect } from 'react-redux';
import { List } from 'immutable';
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
import Table from '../common/Table';
import { getDataset, clearDataset } from '../../actions';
import DatasetInformationTable from './DatasetInformationTable';
import Loader from '../common/Loader';
import {
  DATASET_BACK_BUTTON_ID,
  DATASET_NAME_ID,
  DATASET_SCREEN_MAIN_ID,
} from '../../config/selectors';
import BackButton from '../common/BackButton';
import SchemaTags from '../common/SchemaTags';
import { GRAASP_SCHEMA_ID, FILE_FORMATS } from '../../shared/constants';

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
  formatButtons: {
    float: 'right',
    marginBottom: theme.spacing(1),
  },
});

class DatasetScreen extends Component {
  state = {
    format: FILE_FORMATS.JSON,
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
      formatButtons: PropTypes.string.isRequired,
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
        format: isTabular ? FILE_FORMATS.CSV : FILE_FORMATS.JSON,
      });
    }
  }

  componentWillUnmount() {
    const { dispatchClearDataset } = this.props;
    dispatchClearDataset();
  }

  renderFormatButtons = () => {
    const { format } = this.state;
    return (
      <ButtonGroup size="small">
        <Button
          variant={format === FILE_FORMATS.JSON ? 'outlined' : 'contained'}
          color="primary"
          onClick={() => {
            this.setState({ format: FILE_FORMATS.JSON });
          }}
        >
          JSON
        </Button>
        <Button
          variant={format === FILE_FORMATS.CSV ? 'outlined' : 'contained'}
          color="primary"
          onClick={() => {
            this.setState({ format: FILE_FORMATS.CSV });
          }}
        >
          CSV
        </Button>
      </ButtonGroup>
    );
  };

  renderTabularView = () => {
    const { datasetContent, t, isTabular } = this.props;

    if (!isTabular) {
      return (
        <Alert severity="error">
          {t("The dataset can't be displayed as a csv.")}
        </Alert>
      );
    }

    const json = JSON.parse(datasetContent);
    const uniqueKeys = json
      .map(Object.keys)
      .reduce((left, right) => [...new Set([...left, ...right])], []);

    const columns = uniqueKeys.map((key) => {
      return {
        columnName: key,
        sortBy: key,
        field: key,
      };
    });

    const rows = List(
      json.map((row) => {
        return Object.fromEntries(
          Object.entries(row).map(([key, value]) => {
            const formattedValue =
              typeof value === 'object' ? JSON.stringify(value) : value;
            return [key, formattedValue];
          }),
        );
      }),
    );

    return <Table rows={rows} columns={columns} />;
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

    const { format } = this.state;

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
    const showTabular = format === FILE_FORMATS.CSV;

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
                  <div className={classes.formatButtons}>
                    {this.renderFormatButtons()}
                  </div>
                </Grid>
              </Grid>
              <Paper
                className={format === FILE_FORMATS.JSON && classes.content}
              >
                {showTabular ? (
                  this.renderTabularView()
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
