import React from 'react';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import FieldSelector from './FieldSelector';

const useStyles = makeStyles((theme) => ({
  content: {
    paddingBottom: theme.spacing(2),
  },
}));

const FieldSelectorModal = (props) => {
  const { open, handleClose, param, onChange, t } = props;
  const { name, value } = param;
  const classes = useStyles();

  const unselectAll = (schema) => {
    const { children } = schema;
    if (children) {
      const newChildren = Object.fromEntries(
        Object.entries(children).map(([childName, child]) => [
          childName,
          unselectAll(child),
        ]),
      );
      return { ...schema, selected: false, children: newChildren };
    }
    return { ...schema, selected: false };
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{name}</DialogTitle>
      <Container className={classes.content}>
        <Button
          size="small"
          color="primary"
          onClick={() => onChange(unselectAll(value))}
        >
          {t('Unselect all')}
        </Button>
        <FieldSelector
          schema={value}
          onChange={(newValue) => onChange(newValue)}
        />
      </Container>
    </Dialog>
  );
};

FieldSelectorModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  param: PropTypes.shape({
    name: PropTypes.string.isRequired,
    value: PropTypes.shape({}).isRequired,
  }).isRequired,
  onChange: PropTypes.func,
  t: PropTypes.func.isRequired,
};

FieldSelectorModal.defaultProps = {
  onChange: () => {},
};

const TranslatedComponent = withTranslation()(FieldSelectorModal);

export default TranslatedComponent;
