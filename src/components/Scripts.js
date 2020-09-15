import React from 'react';
import { useTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Main from './common/Main';
import { EXECUTE_PYTHON_SCRIPT } from '../config/channels';

const Scripts = () => {
  const { t } = useTranslation();

  const executePythonScript = () => {
    window.ipcRenderer.send(EXECUTE_PYTHON_SCRIPT, { scriptId: 1 });
  };

  return (
    <Main fullScreen>
      {/* todo: turn this into a list showing different scripts that can be executed */}
      <Typography
        variant="subtitle1"
        color="inherit"
        style={{ margin: '2rem' }}
      >
        {t('Execute script 1 (Hash user ids)')}
      </Typography>
      <Button variant="contained" color="primary" onClick={executePythonScript}>
        {t('Run Script')}
      </Button>
    </Main>
  );
};

export default Scripts;
