import React from 'react';
import { useTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Main from './common/Main';
import { EXECUTE_PRINT_ID_SCRIPT } from '../config/channels';

const Scripts = () => {
  const { t } = useTranslation();

  const executePrintIdScript = () => {
    window.ipcRenderer.send(EXECUTE_PRINT_ID_SCRIPT);
  };

  return (
    <Main fullScreen>
      {/* todo: turn this into a list showing different scripts that can be executed */}
      <Typography
        variant="subtitle1"
        color="inherit"
        style={{ margin: '2rem' }}
      >
        {t('Print action ids')}
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={executePrintIdScript}
      >
        {t('Run Script')}
      </Button>
    </Main>
  );
};

export default Scripts;
