import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import SaveIcon from '@material-ui/icons/Save';
import { Map } from 'immutable';
import { ColorPicker } from 'material-ui-color';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import ReactJson from 'react-json-view';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { setSchema } from '../../actions';
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
                  onChange={this.handleLabelOnChange}
                  label={t('Label')}
                  value={label}
                  fullWidth
                  disabled={isGraasp}
                />
              </Grid>
              <Grid item>
                <TextField
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
          <BackButton className={classes.backButton} />
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
