import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import {
  SHOW_LOAD_DATASET_PROMPT_CHANNEL,
  RESPOND_LOAD_DATASET_PROMPT_CHANNEL,
} from '../config/channels';
import { addDataset } from '../actions';

const styles = () => ({
  dialogContent: {
    display: 'flex',
    flexDirection: 'column',
  },
  addDataset: {
    display: 'flex',
    alignItems: 'center',
  },
  shortTextfield: {
    width: '50%',
  },
});

class LoadDataset extends Component {
  state = {
    fileLocation: '',
    fileCustomName: '',
    fileDescription: '',
  };

  static propTypes = {
    classes: PropTypes.shape({
      dialogContent: PropTypes.shape({
        display: PropTypes.string,
        flexDirection: PropTypes.string,
      }),
      addDataset: PropTypes.shape({
        display: PropTypes.string,
        alignItems: PropTypes.string,
      }),
      shortTextfield: PropTypes.shape({ width: PropTypes.string }),
    }).isRequired,
    t: PropTypes.func.isRequired,
    open: PropTypes.func.isRequired,
    handleClose: PropTypes.func.isRequired,
    dispatchAddDataset: PropTypes.func.isRequired,
  };

  handleLocationInput = (event) => {
    const filePath = event.target ? event.target.value : event;
    this.setState({ fileLocation: filePath });
  };

  handleCustomNameInput = (event) => {
    this.setState({ fileCustomName: event.target.value });
  };

  handleDescriptionInput = (event) => {
    this.setState({ fileDescription: event.target.value });
  };

  handleBrowse = () => {
    const options = {
      filters: [{ name: 'json', extensions: ['json'] }],
    };
    window.ipcRenderer.send(SHOW_LOAD_DATASET_PROMPT_CHANNEL, options);
    window.ipcRenderer.once(
      RESPOND_LOAD_DATASET_PROMPT_CHANNEL,
      (event, filePaths) => {
        if (filePaths && filePaths.length) {
          // currently we select only one file
          this.handleLocationInput(filePaths[0]);
        }
      },
    );
  };

  handleFileSubmit = () => {
    const { fileCustomName, fileLocation, fileDescription } = this.state;
    const { dispatchAddDataset } = this.props;
    dispatchAddDataset({ fileCustomName, fileLocation, fileDescription });
  };

  render() {
    const { classes, t, open, handleClose } = this.props;
    const { fileLocation, fileCustomName, fileDescription } = this.state;

    return (
      <Dialog
        open={open}
        onClose={() => {
          this.setState({
            fileLocation: '',
            fileCustomName: '',
            fileDescription: '',
          });
          handleClose();
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle id="create-new-item-form">
          {t('Add new dataset')}
        </DialogTitle>
        <DialogContent className={classes.dialogContent}>
          <div className={classes.addDataset}>
            <TextField
              autoFocus
              margin="dense"
              id="browse"
              label="Select dataset"
              className={classes.shortTextfield}
              onChange={this.handleLocationInput}
              value={fileLocation}
            />
            <IconButton onClick={this.handleBrowse}>
              <SearchIcon />
            </IconButton>
          </div>

          <TextField
            margin="dense"
            id="name"
            label="Name"
            value={fileCustomName}
            onChange={this.handleCustomNameInput}
            className={classes.shortTextfield}
          />

          <TextField
            margin="dense"
            id="description"
            label="Description"
            value={fileDescription}
            onChange={this.handleDescriptionInput}
            multiline
            rows={4}
            rowsMax={4}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              this.setState({
                fileLocation: '',
                fileCustomName: '',
                fileDescription: '',
              });
              handleClose();
            }}
            color="primary"
          >
            {t('Cancel')}
          </Button>
          <Button
            onClick={() => {
              this.handleFileSubmit();
              this.setState({
                fileLocation: '',
                fileCustomName: '',
                fileDescription: '',
              });
              handleClose();
            }}
            color="primary"
            disabled={!fileLocation.endsWith('.json')}
          >
            {t('Add dataset')}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = {
  dispatchAddDataset: addDataset,
};

const ConnectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps,
)(LoadDataset);

const StyledComponent = withStyles(styles, { withTheme: true })(
  ConnectedComponent,
);

const TranslatedComponent = withTranslation()(StyledComponent);

export default TranslatedComponent;
