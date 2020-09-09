import React, { useState } from 'react';
import { withRouter } from 'react-router';
import { useTranslation } from 'react-i18next';
import FormControl from '@material-ui/core/FormControl';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import Main from './common/Main';
import { showBrowsePrompt } from '../utils/browse';
import { CREATE_FILE_COPY } from '../config/channels';

const LoadFile = () => {
  const { t } = useTranslation();
  const [fileLocation, setFileLocation] = useState('');

  const handleFileLocation = (event) => {
    const filePath = event.target ? event.target.value : event;
    console.log('hey', filePath);
    setFileLocation(filePath);
  };

  const handleBrowse = () => {
    showBrowsePrompt(handleFileLocation);
  };

  const handleCopy = () => {
    console.log('I am sending the file...');
    console.log(CREATE_FILE_COPY);
    console.log({ fileLocation });
    window.ipcRenderer.send(CREATE_FILE_COPY, { fileLocation });
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
          //   disabled={!fileLocation.endsWith('.zip')}
        >
          {t('Submit')}
        </Button>
      </FormControl>
    </Main>
  );
};

export default withRouter(LoadFile);
