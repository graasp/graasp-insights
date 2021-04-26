import React from 'react';
import Grid from '@material-ui/core/Grid';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import {
  DEFAULT_TAG_STYLE,
  MAX_SHOWN_SCHEMA_TAGS,
} from '../../config/constants';
import { buildSchemaPath } from '../../config/paths';
import SchemaTag from './SchemaTag';

const SchemaTags = ({ schemaIds, showTooltip }) => {
  const schemas = useSelector((state) => state.schema.get('schemas'));
  const { t } = useTranslation();
  const { push } = useHistory();

  if (!schemaIds) {
    return null;
  }

  const handleSchemaOnClick = (id) => {
    push(buildSchemaPath(id));
  };

  const tags = schemaIds.slice(0, MAX_SHOWN_SCHEMA_TAGS).map((schemaId) => {
    const schema = schemas.get(schemaId);
    return (
      <Grid item key={schemaId}>
        <SchemaTag
          schema={schema}
          tooltip={showTooltip && `${t('Detected schema')}: ${schema?.label}`}
          onClick={() => showTooltip && handleSchemaOnClick(schemaId)}
        />
      </Grid>
    );
  });

  if (schemaIds?.length > MAX_SHOWN_SCHEMA_TAGS) {
    tags.push(
      <Grid item key="...">
        <SchemaTag
          schema={{
            label: '...',
            tagStyle: DEFAULT_TAG_STYLE,
          }}
          tooltip={
            showTooltip &&
            schemaIds
              ?.slice(MAX_SHOWN_SCHEMA_TAGS)
              .map((schemaId) => schemas.get(schemaId)?.label)
              .join(', ')
          }
        />
      </Grid>,
    );
  }

  return tags;
};

SchemaTags.defaultProps = {
  showTooltip: true,
};

export default SchemaTags;
