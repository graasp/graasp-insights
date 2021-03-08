import React, { useRef } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Tooltip from '@material-ui/core/Tooltip';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import Select from '@material-ui/core/Select';
import Container from '@material-ui/core/Container';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import InfoIcon from '@material-ui/icons/Info';
import Main from './common/Main';
import { formatFileSize } from '../shared/formatting';
import { langs } from '../config/i18n';
import {
  getLanguage,
  setFileSizeLimit,
  setLanguage,
  getFileSizeLimit,
  clearDatabase,
} from '../actions';
import {
  DEFAULT_FILE_SIZE_LIMIT,
  FILE_SIZE_LIMIT_OPTIONS,
} from '../shared/constants';
import {
  SETTINGS_FILE_SIZE_LIMIT_SELECT_ID,
  SETTINGS_LANG_SELECT,
  SETTINGS_MAIN_ID,
  SETTINGS_CLEAR_DATABASE_BUTTON_ID,
  SETTINGS_CLEAR_DATABASE_SAMPLE_DB_CHECKBOX_ID,
} from '../config/selectors';

const styles = (theme) => ({
  formControl: {
    width: '50%',
    margin: theme.spacing(2, 0),
  },
  content: {
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
  },
  clearDatabaseButton: {
    marginTop: theme.spacing(1),
    backgroundColor: '#D22B2B',
    color: '#FFF',
    '&:hover': {
      backgroundColor: '#C41E3A',
    },
  },
  sampleDatabaseCheckboxLabel: {
    fontSize: '1em',
  },
});

const Settings = (props) => {
  const {
    dispatchGetLanguage,
    dispatchSetLanguage,
    lang,
    t,
    classes,
    dispatchSetFileSizeLimit,
    fileSizeLimit = DEFAULT_FILE_SIZE_LIMIT,
    dispatchGetFileSizeLimit,
    dispatchClearDatabase,
  } = props;
  dispatchGetLanguage();
  dispatchGetFileSizeLimit();
  let checkboxRef = useRef(null);

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
      <FormControl className={classes.formControl} id={SETTINGS_LANG_SELECT}>
        <FormLabel>{t('Language')}</FormLabel>
        <FormHelperText />
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
      optionIdx = FILE_SIZE_LIMIT_OPTIONS.reduce((prev, curr, i) => {
        return Math.abs(curr - fileSizeLimit) < Math.abs(prev - fileSizeLimit)
          ? i
          : prev;
      }, 0);
    }

    const control = (
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
    );

    return (
      <FormControl
        className={classes.formControl}
        id={SETTINGS_FILE_SIZE_LIMIT_SELECT_ID}
      >
        <FormLabel>{t('File Size Limit')}</FormLabel>
        <FormHelperText>
          {t(
            'A warning will appear when opening datasets bigger than this limit.',
          )}
        </FormHelperText>
        {control}
      </FormControl>
    );
  };

  const renderClearDatabase = () => {
    const handleClearDatabase = () => {
      dispatchClearDatabase({ useSampleDatabase: checkboxRef.checked });
    };

    const useSampleDatabaseCheckbox = (
      <Checkbox
        id={SETTINGS_CLEAR_DATABASE_SAMPLE_DB_CHECKBOX_ID}
        color="primary"
        inputProps={{
          'aria-label': 'primary checkbox',
          // eslint-disable-next-line no-return-assign
          ref: (ref) => (checkboxRef = ref),
        }}
      />
    );

    return (
      <FormControl className={classes.formControl}>
        <FormLabel>{t('Clear Application Data')}</FormLabel>
        <FormHelperText>
          {t(
            'Delete all of your datasets, schemas, algorithms, executions, and results. You will have a chance to confirm this action after clicking the button.',
          )}
        </FormHelperText>
        <div>
          <FormControlLabel
            classes={{ label: classes.sampleDatabaseCheckboxLabel }}
            control={useSampleDatabaseCheckbox}
            label={t('Reload Default Algorithms and Schema')}
          />
          <Tooltip
            title={t(
              'Provided by the application developer, these algorithms and schema are optimized to process Graasp datasets.',
            )}
            placement="right"
          >
            <IconButton color="primary">
              <InfoIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </div>
        <Button
          id={SETTINGS_CLEAR_DATABASE_BUTTON_ID}
          variant="contained"
          className={classes.clearDatabaseButton}
          startIcon={<DeleteIcon />}
          onClick={handleClearDatabase}
        >
          {t('Clear all data')}
        </Button>
      </FormControl>
    );
  };

  return (
    <Main id={SETTINGS_MAIN_ID}>
      <Container className={classes.content}>
        <Typography variant="h4">{t('Settings')}</Typography>
        {renderLanguageSelect()}
        {renderFileSizeLimit()}
        {renderClearDatabase()}
      </Container>
    </Main>
  );
};

Settings.propTypes = {
  lang: PropTypes.string.isRequired,
  dispatchGetLanguage: PropTypes.func.isRequired,
  dispatchSetLanguage: PropTypes.func.isRequired,
  dispatchGetFileSizeLimit: PropTypes.func.isRequired,
  dispatchSetFileSizeLimit: PropTypes.func.isRequired,
  dispatchClearDatabase: PropTypes.func.isRequired,
  fileSizeLimit: PropTypes.number.isRequired,
  t: PropTypes.func.isRequired,
  classes: PropTypes.shape({
    formControl: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    clearDatabaseButton: PropTypes.string.isRequired,
    sampleDatabaseCheckboxLabel: PropTypes.string.isRequired,
  }).isRequired,
  i18n: PropTypes.shape({
    changeLanguage: PropTypes.func.isRequired,
  }).isRequired,
};

const mapStateToProps = ({ settings }) => ({
  lang: settings.get('lang'),
  fileSizeLimit: settings.get('fileSizeLimit'),
});

const mapDispatchToProps = {
  dispatchGetLanguage: getLanguage,
  dispatchSetLanguage: setLanguage,
  dispatchSetFileSizeLimit: setFileSizeLimit,
  dispatchGetFileSizeLimit: getFileSizeLimit,
  dispatchClearDatabase: clearDatabase,
};

const ConnectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Settings);

const StyledComponent = withStyles(styles)(ConnectedComponent);

export default withTranslation()(StyledComponent);
