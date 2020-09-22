import React from 'react';
import { useTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Main from './common/Main';
import { EXECUTE_PYTHON_ALGORITHM } from '../config/channels';

const Algorithms = () => {
  const { t } = useTranslation();

  const executePythonAlgorithm = () => {
    window.ipcRenderer.send(EXECUTE_PYTHON_ALGORITHM, { id: 1 });
  };

  return (
    <Main fullScreen>
      {/* todo: turn this into a list showing different algorithms that can be executed */}
      <Typography
        variant="subtitle1"
        color="inherit"
        style={{ margin: '2rem' }}
      >
        {t('Execute algorithm 1 (Hash user ids)')}
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={executePythonAlgorithm}
      >
        {t('Run Algorithm')}
      </Button>
    </Main>
  );
};

export default Algorithms;
