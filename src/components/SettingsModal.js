import React from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';

import PropTypes from 'prop-types';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Container from '@material-ui/core/Container';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import { formatFileSize } from '../utils/formatting';
import { langs } from '../config/i18n';
import {
  getLanguage,
  setFileSizeLimit,
  setLanguage,
  getFileSizeLimit,
} from '../actions';
import {
  DEFAULT_FILE_SIZE_LIMIT,
  FILE_SIZE_LIMIT_OPTIONS,
} from '../config/constants';

const styles = (theme) => ({
  formControl: {
    width: theme.spacing(25),
    margin: theme.spacing(1, 0),
  },
  content: {
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
  },
});

const SettingsModal = (props) => {
  const {
    dispatchGetLanguage,
    dispatchSetLanguage,
    lang,
    t,
    classes,
    open,
    handleClose,
    dispatchSetFileSizeLimit,
    fileSizeLimit,
    dispatchGetFileSizeLimit,
  } = props;
  dispatchGetLanguage();
  dispatchGetFileSizeLimit();

  const handleChangeLanguage = async (event) => {
    const { value: newLang } = event.target;
    const { i18n } = props;
    await i18n.changeLanguage(newLang);
    dispatchSetLanguage({ lang: newLang });
  };

  const handleChangeFileSizeLimit = (event) => {
    const { value: newLimit } = event.target;
    dispatchSetFileSizeLimit(newLimit);
  };

  const renderLanguageSelect = () => {
    return (
      <FormControl className={classes.formControl}>
        <InputLabel shrink htmlFor="languageId">
          {t('Language')}
        </InputLabel>
        <Select
          value={lang}
          onChange={handleChangeLanguage}
          inputProps={{
            name: 'language',
            id: 'languageId',
          }}
        >
          {Object.keys(langs).map((langOption) => (
            <MenuItem key={langOption} value={langOption}>
              {langs[langOption]}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  };

  const renderFileSizeLimit = () => {
    let optionIdx = FILE_SIZE_LIMIT_OPTIONS.indexOf(fileSizeLimit);
    if (optionIdx < 0) {
      // select closest option given set file size limit
      optionIdx = FILE_SIZE_LIMIT_OPTIONS.reduce((prev, curr) => {
        return Math.abs(curr - fileSizeLimit) < Math.abs(prev - fileSizeLimit)
          ? curr
          : prev;
      });
    }

    return (
      <FormControl className={classes.formControl}>
        <InputLabel shrink htmlFor="fileSizeLimitId">
          {t('File Size Limit')}
        </InputLabel>
        <Select
          value={FILE_SIZE_LIMIT_OPTIONS[optionIdx]}
          onChange={handleChangeFileSizeLimit}
          inputProps={{
            name: 'fileSizeLimit',
            id: 'fileSizeLimitId',
          }}
        >
          {FILE_SIZE_LIMIT_OPTIONS.map((size) => (
            <MenuItem key={`limit-${size}`} value={size}>
              {formatFileSize(size)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{t('Settings')}</DialogTitle>
      <Container className={classes.content}>
        {renderLanguageSelect()}
        {renderFileSizeLimit()}
      </Container>
    </Dialog>
  );
};

SettingsModal.propTypes = {
  lang: PropTypes.string.isRequired,
  dispatchGetLanguage: PropTypes.func.isRequired,
  dispatchSetLanguage: PropTypes.func.isRequired,
  dispatchGetFileSizeLimit: PropTypes.func.isRequired,
  dispatchSetFileSizeLimit: PropTypes.func.isRequired,
  fileSizeLimit: PropTypes.number.isRequired,
  t: PropTypes.func.isRequired,
  classes: PropTypes.shape({
    formControl: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
  }).isRequired,
  i18n: PropTypes.shape({
    changeLanguage: PropTypes.func.isRequired,
  }).isRequired,
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

const mapStateToProps = ({ settings }) => ({
  lang: settings.get('lang'),
  fileSizeLimit: settings.get('fileSizeLimit', DEFAULT_FILE_SIZE_LIMIT),
});

const mapDispatchToProps = {
  dispatchGetLanguage: getLanguage,
  dispatchSetLanguage: setLanguage,
  dispatchSetFileSizeLimit: setFileSizeLimit,
  dispatchGetFileSizeLimit: getFileSizeLimit,
};

const ConnectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps,
)(SettingsModal);

const StyledComponent = withStyles(styles)(ConnectedComponent);

export default withTranslation()(StyledComponent);
