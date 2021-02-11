import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import SaveIcon from '@material-ui/icons/Save';
import Alert from '@material-ui/lab/Alert';
import { Map } from 'immutable';
import { ColorPicker } from 'material-ui-color';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import ReactJson from 'react-json-view';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { openUrlInBrowser, setSchema } from '../../actions';
import { JSON_SCHEMA_GETTING_STARTED_URL } from '../../config/constants';
import {
  SCHEMA_VIEW_BACK_BUTTON_ID,
  SCHEMA_VIEW_DESCRIPTION_ID,
  SCHEMA_VIEW_LABEL_ID,
  SCHEMA_VIEW_SAVE_BUTTON_ID,
} from '../../config/selectors';
import { GRAASP_SCHEMA_ID } from '../../shared/constants';
import { generateTextColorFromBackground } from '../../utils/color';
import BackButton from '../common/BackButton';
import Main from '../common/Main';
import SchemaTag from '../common/SchemaTag';

const styles = (theme) => ({
  schemaContent: {
    padding: theme.spacing(1),
  },
  backButton: {
    position: 'fixed',
    right: theme.spacing(2),
    bottom: theme.spacing(2),
  },
  title: {
    marginBottom: theme.spacing(2),
  },
  tagWrapper: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    textAlign: 'center',
  },
  tag: {
    fontSize: 2 * theme.typography.fontSize,
  },
  saveButtonWrapper: {
    textAlign: 'center',
    margin: theme.spacing(2),
  },
  infoAlert: {
    marginBottom: theme.spacing(1),
  },
  urlString: {
    display: 'inline',
    marginTop: theme.spacing(1),
    textTransform: 'none',
    fontFamily: 'courier new',
    padding: theme.spacing(0),
    userSelect: 'auto',
  },
});

class SchemaView extends Component {
  state = {
    label: '',
    description: '',
    tagStyle: {},
    schemaDef: {},
    modified: false,
    createdAt: Date.now(),
  };

  static propTypes = {
    schemas: PropTypes.instanceOf(Map).isRequired,
    dispatchSetSchema: PropTypes.func.isRequired,
    dispatchOpenUrlInBrowser: PropTypes.func.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
    t: PropTypes.func.isRequired,
    classes: PropTypes.shape({
      schemaContent: PropTypes.string.isRequired,
      backButton: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      tagWrapper: PropTypes.string.isRequired,
      tag: PropTypes.string.isRequired,
      saveButtonWrapper: PropTypes.string.isRequired,
      infoAlert: PropTypes.string.isRequired,
      urlString: PropTypes.string.isRequired,
    }).isRequired,
  };

  componentDidMount() {
    const {
      schemas,
      match: {
        params: { id },
      },
    } = this.props;

    const {
      label,
      description,
      tagStyle,
      schema: schemaDef,
      createdAt,
    } = schemas.get(id);

    this.setState({ label, description, tagStyle, schemaDef, createdAt });
  }

  handleLabelOnChange = ({ target: { value: label } }) => {
    this.setState({
      label,
      modified: true,
    });
  };

  handleDescriptionOnChange = ({ target: { value: description } }) => {
    this.setState({
      description,
      modified: true,
    });
  };

  handleColorOnChange = ({ hex, rgb }) => {
    this.setState({
      tagStyle: {
        color: generateTextColorFromBackground(rgb),
        backgroundColor: `#${hex}`,
      },
      modified: true,
    });
  };

  handleSave = () => {
    const {
      dispatchSetSchema,
      match: {
        params: { id },
      },
    } = this.props;
    const {
      label,
      description,
      tagStyle,
      schemaDef,
      modified,
      createdAt,
    } = this.state;
    if (modified) {
      dispatchSetSchema({
        id,
        label,
        description,
        tagStyle,
        schema: schemaDef,
        createdAt,
      });
    }

    this.setState({ modified: false });
  };

  handleSchemaOnChange = ({ updated_src: schemaDef }) => {
    this.setState({ schemaDef, modified: true });
  };

  JSONSchemaLearnMoreOnClick = () => {
    const { dispatchOpenUrlInBrowser } = this.props;
    dispatchOpenUrlInBrowser(JSON_SCHEMA_GETTING_STARTED_URL);
  };

  render() {
    const {
      match: {
        params: { id },
      },
      t,
      classes,
      schemas,
    } = this.props;
    const { label, description, tagStyle, schemaDef, modified } = this.state;

    const schema = schemas.get(id);
    const isGraasp = id === GRAASP_SCHEMA_ID;

    return (
      <Main>
        <Container>
          <div className={classes.tagWrapper}>
            <SchemaTag schema={schema} size="medium" className={classes.tag} />
          </div>
          <Grid container justify="space-evenly">
            <Grid item xs={6}>
              {!isGraasp && (
                <Alert severity="info" className={classes.infoAlert}>
                  {`${t(
                    'You can enforce the presence of fields with the "required" attribute. Learn more about JSON schemas at',
                  )}:`}
                  <Button
                    onClick={this.JSONSchemaLearnMoreOnClick}
                    className={classes.urlString}
                    size="small"
                  >
                    {JSON_SCHEMA_GETTING_STARTED_URL}
                  </Button>
                </Alert>
              )}
              <Paper className={classes.schemaContent}>
                <ReactJson
                  collapsed={4}
                  src={schemaDef}
                  onEdit={!isGraasp && this.handleSchemaOnChange}
                  onAdd={!isGraasp && this.handleSchemaOnChange}
                  onDelete={!isGraasp && this.handleSchemaOnChange}
                />
              </Paper>
            </Grid>
            <Grid item container xs={3} spacing={3} direction="column">
              <Grid item>
                <TextField
                  id={SCHEMA_VIEW_LABEL_ID}
                  onChange={this.handleLabelOnChange}
                  label={t('Label')}
                  value={label}
                  fullWidth
                  disabled={isGraasp}
                />
              </Grid>
              <Grid item>
                <TextField
                  id={SCHEMA_VIEW_DESCRIPTION_ID}
                  onChange={this.handleDescriptionOnChange}
                  label={t('Description')}
                  value={description}
                  fullWidth
                  disabled={isGraasp}
                  multiline
                  rowsMax={4}
                />
              </Grid>
              <Grid item container alignItems="center">
                <Grid item>
                  <Typography>{`${t('Tag color')}:`}</Typography>
                </Grid>
                <Grid item>
                  <ColorPicker
                    value={tagStyle?.backgroundColor}
                    disableAlpha
                    hideTextfield
                    deferred
                    onChange={isGraasp ? () => {} : this.handleColorOnChange}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          {!isGraasp && (
            <div className={classes.saveButtonWrapper}>
              <Button
                id={SCHEMA_VIEW_SAVE_BUTTON_ID}
                variant="contained"
                color="primary"
                startIcon={<SaveIcon />}
                onClick={this.handleSave}
                disabled={!modified}
              >
                {t('Save')}
              </Button>
            </div>
          )}
          <BackButton
            id={SCHEMA_VIEW_BACK_BUTTON_ID}
            className={classes.backButton}
          />
        </Container>
      </Main>
    );
  }
}

const mapStateToProps = ({ schema }) => ({
  schemas: schema.get('schemas'),
});

const mapDispatchToProps = {
  dispatchSetSchema: setSchema,
  dispatchOpenUrlInBrowser: openUrlInBrowser,
};

const ConnectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps,
)(SchemaView);
const StyledComponent = withStyles(styles, { withTheme: true })(
  ConnectedComponent,
);
const TranslatedComponent = withTranslation()(StyledComponent);

export default withRouter(TranslatedComponent);
