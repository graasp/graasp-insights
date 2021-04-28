import React from 'react';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { buildFieldSelectorCheckbox } from '../../config/selectors';
import { fieldSelectorUnselectAll } from '../../shared/utils';
import { anySelected } from '../../utils/parameter';

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
    color: theme.palette.green.main,
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
}));

const FieldSelector = ({ schema, onChange, disabled, id }) => {
  const { t } = useTranslation();
  const classes = useStyles();

  if (!schema) {
    return null;
  }

  return (
    <Paper elevation={2} id={id}>
      <FieldSelectorTree
        name="root"
        field={schema}
        onChange={onChange}
        disabled={disabled}
      />
      <Button
        className={classes.unselectButton}
        size="small"
        onClick={() => onChange(fieldSelectorUnselectAll(schema))}
        disableRipple
        disabled={disabled}
      >
        {t('Unselect all')}
      </Button>
    </Paper>
  );
};

FieldSelector.propTypes = {
  id: PropTypes.string,
  schema: PropTypes.shape({
    properties: PropTypes.shape({}).isRequired,
  }).isRequired,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
};

FieldSelector.defaultProps = {
  onChange: () => {},
  disabled: false,
  id: null,
};

const FieldSelectorTree = ({ name, field, onChange, disabled }) => {
  const { type, selected, expanded, properties, items } = field;
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

  const children = [];
  let childSelected = false;

  // if type is 'object', then 'properties' defines the content for each of its properties
  // {
  //   type: "object",
  //   properties: {
  //     prop1: {...},
  //     prop2: {...},
  //     ...
  //   }
  // }
  if (type?.includes('object') && properties) {
    const newChildren = Object.entries(properties).map(([key, childField]) => (
      <FieldSelectorTree
        key={key}
        name={key}
        field={childField}
        disabled={disabled}
        onChange={(updatedField) => {
          onChange({
            ...field,
            properties: { ...properties, [key]: updatedField },
          });
        }}
      />
    ));

    // append the new children elements to the children we will render
    // (concatenate two arrays)
    Array.prototype.push.apply(children, newChildren);

    // check if any of the properties is selected
    childSelected =
      childSelected || anySelected({ type: 'object', properties });
  }

  // if type is 'array', then 'items' defines the content of the array's elements
  // {
  //   type: "array",
  //   items: {
  //     type: "object",
  //     properties: {...}
  //   }
  // }
  if (type?.includes('array') && items && _.isPlainObject(items)) {
    const { type: subType, properties: arrayProperties } = items;
    if (subType?.includes('object') && arrayProperties) {
      const newChildren = Object.entries(arrayProperties).map(
        ([key, childField]) => (
          <FieldSelectorTree
            key={key}
            name={key}
            field={childField}
            disabled={disabled}
            onChange={(updatedField) => {
              onChange({
                ...field,
                items: {
                  ...items,
                  properties: { ...arrayProperties, [key]: updatedField },
                },
              });
            }}
          />
        ),
      );

      // append the new children elements to the children we will render
      // (concatenate two arrays)
      Array.prototype.push.apply(children, newChildren);

      // check if any of the array sub-elements is selected
      childSelected =
        childSelected ||
        anySelected({ type: 'object', properties: arrayProperties });
    }
  }

  // show expand button only if it has children
  const expandVisibility = children.length ? 'visible' : 'hidden';

  return (
    <div>
      {/* expand button */}
      <IconButton
        aria-label="expand"
        onClick={toggleExpanded}
        className={classes.expandButton}
        disabled={!children.length}
      >
        {expanded ? (
          <ArrowDropUpIcon visibility={expandVisibility} />
        ) : (
          <ArrowDropDownIcon visibility={expandVisibility} />
        )}
      </IconButton>
      {/* checkbox */}
      {
        <FormControlLabel
          control={
            // eslint-disable-next-line react/jsx-wrap-multilines
            <Checkbox
              id={buildFieldSelectorCheckbox(name)}
              checked={selected}
              onChange={handleCheckboxOnChange}
              color="primary"
              className={classes.checkbox}
              indeterminate={!selected && childSelected}
              disabled={disabled}
            />
          }
          label={name}
        />
      }
      {/* render children (if expanded) */}
      {children && expanded && (
        <div className={classes.shifted}>{children}</div>
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
  disabled: PropTypes.bool,
};

FieldSelectorTree.defaultProps = {
  onChange: () => {},
  disabled: false,
};

export default FieldSelector;
