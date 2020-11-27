import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import PropTypes from 'prop-types';
import React from 'react';
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
}));

const FieldSelector = ({ schema: { children }, onChange }) => {
  return (
    <Paper elevation={2}>
      {Object.entries(children).map(([name, properties]) => (
        <FieldSelectorTree
          key={name}
          name={name}
          properties={properties}
          onChange={(updatedProperty) => {
            onChange({
              ...properties,
              children: { ...children, [name]: updatedProperty },
            });
          }}
        />
      ))}
    </Paper>
  );
};

FieldSelector.propTypes = {
  schema: PropTypes.shape({
    children: PropTypes.shape({}).isRequired,
  }).isRequired,
  onChange: PropTypes.func,
};

FieldSelector.defaultProps = {
  onChange: () => {},
};

const FieldSelectorTree = ({
  name,
  properties: { selected, expanded, children },
  onChange,
}) => {
  const classes = useStyles();

  const handleCheckboxOnChange = (event) => {
    // change selected field and notify parent
    const { checked } = event.target;
    onChange({ selected: checked, expanded, children });
  };

  const toggleExpanded = () => {
    // toggle expand field and notify parent
    onChange({ selected, expanded: !expanded, children });
  };

  // show expand button only if it has children
  const expandVisibility = children ? 'visible' : 'hidden';

  return (
    <div>
      {/* expand button */}
      <IconButton
        aria-label="expand"
        onClick={toggleExpanded}
        className={classes.expandButton}
        disabled={!children}
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
            indeterminate={!selected && anySelected({ children })}
          />
        }
        label={name}
      />
      {/* recursively render children */}
      {children && expanded && (
        <div className={classes.shifted}>
          {Object.entries(children).map(([childName, childProperties]) => {
            return (
              <FieldSelectorTree
                key={childName}
                name={childName}
                properties={{ ...childProperties }}
                onChange={(updatedProperty) => {
                  onChange({
                    selected,
                    expanded,
                    children: { ...children, [childName]: updatedProperty },
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
  properties: PropTypes.shape({
    selected: PropTypes.bool.isRequired,
    expanded: PropTypes.bool,
    children: PropTypes.shape({}),
  }).isRequired,
  onChange: PropTypes.func,
};

FieldSelectorTree.defaultProps = {
  onChange: () => {},
};

export default FieldSelector;
