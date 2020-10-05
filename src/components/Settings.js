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

import Main from './common/Main';
import { langs } from '../config/i18n';
import { getLanguage, setLanguage } from '../actions';

const styles = () => ({
  formControl: {
    width: '100%',
  },
});

const Settings = (props) => {
  const { dispatchGetLanguage, dispatchSetLanguage, lang, t, classes } = props;
  dispatchGetLanguage();

  const handleChangeLanguage = async (event) => {
    const { value: newLang } = event.target;
    const { i18n } = props;
    await i18n.changeLanguage(newLang);
    dispatchSetLanguage({ lang: newLang });
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

  return (
    <Main>
      <Container>
        <h1>{t('Settings')}</h1>
        {renderLanguageSelect()}
      </Container>
    </Main>
  );
};

Settings.propTypes = {
  lang: PropTypes.string.isRequired,
  dispatchGetLanguage: PropTypes.func.isRequired,
  dispatchSetLanguage: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  classes: PropTypes.shape({
    formControl: PropTypes.string.isRequired,
  }).isRequired,
  i18n: PropTypes.shape({
    changeLanguage: PropTypes.func.isRequired,
  }).isRequired,
};

const mapStateToProps = ({ settings }) => ({
  lang: settings.get('lang'),
});

const mapDispatchToProps = {
  dispatchGetLanguage: getLanguage,
  dispatchSetLanguage: setLanguage,
};

const ConnectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Settings);

const StyledComponent = withStyles(styles)(ConnectedComponent);

export default withTranslation()(StyledComponent);
