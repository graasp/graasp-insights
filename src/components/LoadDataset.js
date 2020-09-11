import React, { useState } from 'react';
import { withRouter } from 'react-router';
import { useTranslation } from 'react-i18next';
import FormControl from '@material-ui/core/FormControl';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import Main from './common/Main';
import {
  SHOW_LOAD_DATASET_PROMPT_CHANNEL,
  RESPOND_LOAD_DATASET_PROMPT_CHANNEL,
  LOAD_DATASET,
} from '../config/channels';

const LoadDataset = () => {
  const { t } = useTranslation();
  const [fileLocation, setFileLocation] = useState('');

  const handleFileLocation = (event) => {
    const filePath = event.target ? event.target.value : event;
    setFileLocation(filePath);
  };

  const handleBrowse = () => {
    const options = {
      filters: [{ name: 'json', extensions: ['json'] }],
    };
    window.ipcRenderer.send(SHOW_LOAD_DATASET_PROMPT_CHANNEL, options);
    window.ipcRenderer.once(
      RESPOND_LOAD_DATASET_PROMPT_CHANNEL,
      (event, filePaths) => {
        if (filePaths && filePaths.length) {
          // currently we select only one file
          handleFileLocation(filePaths[0]);
        }
      },
    );
  };

  const handleCopy = () => {
    window.ipcRenderer.send(LOAD_DATASET, { fileLocation });
  };

  return (
    <Main fullScreen>
      <FormControl>
        <Typography variant="h4" color="inherit" style={{ margin: '2rem' }}>
          {t('Load a File')}
        </Typography>
        <Button
          // id={LOAD_BROWSE_BUTTON_ID}
          variant="contained"
          onClick={handleBrowse}
          color="primary"
          // className={classes.button}
        >
          {t('Browse')}
        </Button>
        <Input
          // id={LOAD_INPUT_ID}
          required
          onChange={handleFileLocation}
          // className={classes.input}
          // inputProps={{
          //   'aria-label': 'Description',
          // }}
          autoFocus
          value={fileLocation}
          type="text"
        />
        <Button
          //   id={LOAD_SUBMIT_BUTTON_ID}
          variant="contained"
          onClick={handleCopy}
          color="primary"
          //   className={classes.button}
          disabled={!fileLocation.endsWith('.json')}
        >
          {t('Submit')}
        </Button>
      </FormControl>
    </Main>
  );
};

export default withRouter(LoadDataset);
