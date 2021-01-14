import React from 'react';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { anySelected } from '../../utils/parameter';
import { fieldSelectorUnselectAll } from '../../shared/utils';

const useStyles = makeStyles((theme) => ({
  shifted: {
    paddingLeft: theme.spacing(3),
  },
  expandButton: {
    padding: theme.spacing(0),
    width: theme.spacing(3),
    height: theme.spacing(3),
    marginRight: theme.spacing(1),
  },
  checkbox: {
    padding: theme.spacing(0),
    width: theme.spacing(3),
    height: theme.spacing(3),
    marginRight: theme.spacing(1),
  },
  unselectButton: {
    padding: theme.spacing(0, 1),
    color: theme.palette.forestgreen,
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
}));

const FieldSelector = ({ schema, onChange }) => {
  const { properties } = schema;
  const { t } = useTranslation();
  const classes = useStyles();

  return (
    <Paper elevation={2}>
      {Object.entries(properties).map(([key, field]) => (
        <FieldSelectorTree
          key={key}
          name={key}
          field={field}
          onChange={(updatedField) => {
            onChange({
              ...schema,
              properties: { ...properties, [key]: updatedField },
            });
          }}
        />
      ))}
      <Button
        className={classes.unselectButton}
        size="small"
        onClick={() => onChange(fieldSelectorUnselectAll(schema))}
        disableRipple
      >
        {t('Unselect all')}
      </Button>
    </Paper>
  );
};

FieldSelector.propTypes = {
  schema: PropTypes.shape({
    properties: PropTypes.shape({}).isRequired,
  }).isRequired,
  onChange: PropTypes.func,
};

FieldSelector.defaultProps = {
  onChange: () => {},
};

const FieldSelectorTree = ({ name, field, onChange }) => {
  const { type, selected, expanded } = field;
  const properties =
    type === 'object' ? field.properties : field?.items?.properties;
  const classes = useStyles();

  const handleCheckboxOnChange = (event) => {
    // change selected field and notify parent
    const { checked } = event.target;
    onChange({ ...field, selected: checked });
  };

  const toggleExpanded = () => {
    // toggle expand field and notify parent
    onChange({ ...field, expanded: !expanded });
  };

  // show expand button only if it has children
  const expandVisibility = properties ? 'visible' : 'hidden';

  return (
    <div>
      {/* expand button */}
      <IconButton
        aria-label="expand"
        onClick={toggleExpanded}
        className={classes.expandButton}
        disabled={!properties}
      >
        {expanded ? (
          <ArrowDropUpIcon visibility={expandVisibility} />
        ) : (
          <ArrowDropDownIcon visibility={expandVisibility} />
        )}
      </IconButton>
      {/* checkbox */}
      <FormControlLabel
        control={
          // eslint-disable-next-line react/jsx-wrap-multilines
          <Checkbox
            checked={selected}
            onChange={handleCheckboxOnChange}
            color="primary"
            className={classes.checkbox}
            indeterminate={
              !selected &&
              properties &&
              anySelected({ type: 'object', properties })
            }
          />
        }
        label={name}
      />
      {/* recursively render children */}
      {properties && expanded && (
        <div className={classes.shifted}>
          {Object.entries(properties).map(([key, childField]) => {
            return (
              <FieldSelectorTree
                key={key}
                name={key}
                field={childField}
                onChange={(updatedField) => {
                  // eslint-disable-next-line no-unused-expressions
                  type === 'object'
                    ? onChange({
                        ...field,
                        properties: { ...properties, [key]: updatedField },
                      })
                    : onChange({
                        ...field,
                        items: {
                          ...field.items,
                          properties: { ...properties, [key]: updatedField },
                        },
                      });
                }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

FieldSelectorTree.propTypes = {
  name: PropTypes.string.isRequired,
  field: PropTypes.shape({
    type: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    selected: PropTypes.bool.isRequired,
    expanded: PropTypes.bool,
    properties: PropTypes.shape({}),
    items: PropTypes.oneOfType([
      PropTypes.shape({ properties: PropTypes.shape({}) }),
      PropTypes.array,
    ]),
  }).isRequired,
  onChange: PropTypes.func,
};

FieldSelectorTree.defaultProps = {
  onChange: () => {},
};

export default FieldSelector;
