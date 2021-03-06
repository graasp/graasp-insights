import React, { Component } from 'react';
import clsx from 'clsx';
import Container from '@material-ui/core/Container';
import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import CodeIcon from '@material-ui/icons/Code';
import DeleteIcon from '@material-ui/icons/Delete';
import Alert from '@material-ui/lab/Alert';
import { Map } from 'immutable';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { deleteSchema, getSchemas, setSchema } from '../../actions';
import { DEFAULT_LOCALE_DATE } from '../../config/constants';
import { buildSchemaPath } from '../../config/paths';
import {
  buildSchemaRowClass,
  SCHEMAS_DELETE_SCHEMA_BUTTON_CLASS,
  SCHEMAS_EMPTY_ALERT_ID,
  SCHEMAS_TABLE_ID,
  SCHEMAS_VIEW_SCHEMA_BUTTON_CLASS,
  SCHEMA_DESCRIPTION_CLASS,
} from '../../config/selectors';
import { FLAG_GETTING_SCHEMAS } from '../../shared/types';
import Loader from '../common/Loader';
import Main from '../common/Main';
import SchemaTag from '../common/SchemaTag';
import Table from '../common/Table';
import AddSchemaButton from './AddSchemaButton';

const styles = (theme) => ({
  backButton: {
    position: 'fixed',
    right: theme.spacing(2),
    bottom: theme.spacing(2),
  },
  content: {
    padding: theme.spacing(2),
  },
  schemaContent: {
    padding: theme.spacing(1),
  },
  buttonGroup: {
    marginTop: theme.spacing(1),
  },
  schemaDescription: {
    display: 'inline-block',
    margin: theme.spacing(1),
  },
  infoAlert: {
    margin: theme.spacing(2),
  },
});

class Schemas extends Component {
  static propTypes = {
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
    schemas: PropTypes.instanceOf(Map).isRequired,
    gettingSchemas: PropTypes.bool.isRequired,
    t: PropTypes.func.isRequired,
    dispatchGetSchemas: PropTypes.func.isRequired,
    dispatchDeleteSchema: PropTypes.func.isRequired,
    classes: PropTypes.shape({
      backButton: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
      schemaContent: PropTypes.string.isRequired,
      buttonGroup: PropTypes.string.isRequired,
      schemaDescription: PropTypes.string.isRequired,
      infoAlert: PropTypes.string.isRequired,
    }).isRequired,
  };

  constructor(props) {
    super(props);
    this.baseState = this.state;
  }

  componentDidMount() {
    const { dispatchGetSchemas } = this.props;
    dispatchGetSchemas();
  }

  handleView = (id) => {
    const {
      history: { push },
    } = this.props;
    push(buildSchemaPath(id));
  };

  handleDelete = (id) => {
    const { dispatchDeleteSchema, schemas } = this.props;
    dispatchDeleteSchema(schemas.get(id));
  };

  render() {
    const { classes, t, schemas, gettingSchemas } = this.props;

    if (gettingSchemas) {
      return (
        <Main>
          <Loader />
        </Main>
      );
    }

    if (!schemas.size) {
      return (
        <Main>
          <Alert
            id={SCHEMAS_EMPTY_ALERT_ID}
            severity="info"
            className={classes.infoAlert}
          >
            {t('No schemas available')}
          </Alert>
          <AddSchemaButton />
        </Main>
      );
    }

    const columns = [
      {
        columnName: t('Schema'),
        sortBy: 'label',
        field: 'schema',
        alignColumn: 'left',
        alignField: 'left',
      },
      {
        columnName: t('Created'),
        sortBy: 'createdAt',
        field: 'createdAt',
        alignColumn: 'right',
        alignField: 'right',
      },
      {
        columnName: t('Last Modified'),
        sortBy: 'lastModified',
        field: 'lastModified',
        alignColumn: 'right',
        alignField: 'right',
      },
      {
        columnName: t('Quick Actions'),
        field: 'quickActions',
        alignColumn: 'right',
        alignField: 'right',
      },
    ];

    const rows = schemas
      .valueSeq()
      .toList()
      .map((schema) => {
        const { id, label, description, createdAt, lastModified } = schema;

        const createdAtString = createdAt
          ? new Date(createdAt).toLocaleString(DEFAULT_LOCALE_DATE)
          : t('Unknown');

        const lastModifiedString = lastModified
          ? new Date(lastModified).toLocaleString(DEFAULT_LOCALE_DATE)
          : t('Unknown');

        return {
          key: id,
          className: buildSchemaRowClass(label),
          label,
          schema: (
            <>
              <SchemaTag schema={schema} size="medium" />
              <Typography
                variant="caption"
                key="description"
                className={clsx(
                  classes.schemaDescription,
                  SCHEMA_DESCRIPTION_CLASS,
                )}
              >
                {description}
              </Typography>
            </>
          ),
          createdAt: createdAtString,
          lastModified: lastModifiedString,
          quickActions: [
            <Tooltip title={t('View Schema')} key="view">
              <IconButton
                aria-label="view"
                className={SCHEMAS_VIEW_SCHEMA_BUTTON_CLASS}
                onClick={() => this.handleView(id)}
              >
                <CodeIcon />
              </IconButton>
            </Tooltip>,
            <Tooltip title={t('Delete Schema')} key="delete">
              <span>
                <IconButton
                  aria-label="delete"
                  onClick={() => this.handleDelete(id)}
                  className={SCHEMAS_DELETE_SCHEMA_BUTTON_CLASS}
                >
                  <DeleteIcon />
                </IconButton>
              </span>
            </Tooltip>,
          ],
        };
      });

    return (
      <Main>
        <Container className={classes.content}>
          <Typography variant="h4">{t('Schemas')}</Typography>
          <Table rows={rows} columns={columns} id={SCHEMAS_TABLE_ID} />
          <AddSchemaButton />
        </Container>
      </Main>
    );
  }
}

const mapStateToProps = ({ schema }) => {
  return {
    schemas: schema.get('schemas'),
    gettingSchemas: Boolean(
      schema.getIn(['activity', FLAG_GETTING_SCHEMAS]).size,
    ),
    lastSchemaIdSet: schema.get('lastSchemaIdSet'),
  };
};

const mapDispatchToProps = {
  dispatchSetSchema: setSchema,
  dispatchDeleteSchema: deleteSchema,
  dispatchGetSchemas: getSchemas,
};

const ConnectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Schemas);
const StyledComponent = withStyles(styles, { withTheme: true })(
  ConnectedComponent,
);
const TranslatedComponent = withTranslation()(StyledComponent);

export default withRouter(TranslatedComponent);
