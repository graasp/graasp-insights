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
import { loadDataset } from '../actions';
import {
  LOAD_DATASET_FILEPATH_ID,
  LOAD_DATASET_CANCEL_BUTTON_ID,
  LOAD_DATASET_NAME_ID,
  LOAD_DATASET_ACCEPT_ID,
  LOAD_DATASET_DESCRIPTION_ID,
} from '../config/selectors';
import BrowseFileButton from './common/BrowseFileButton';
import { FILE_FILTERS } from '../config/constants';
import { getNameFromLocation } from '../utils/formatting';

const styles = () => ({
  dialogContent: {
    display: 'flex',
    flexDirection: 'column',
  },
  loadDataset: {
    display: 'flex',
    alignItems: 'center',
  },
  shortTextfield: {
    width: '50%',
  },
});

class LoadDatasetModal extends Component {
  state = {
    fileLocation: '',
    fileCustomName: '',
    fileDescription: '',
    defaultDatasetName: '',
  };

  static propTypes = {
    classes: PropTypes.shape({
      dialogContent: PropTypes.string.isRequired,
      loadDataset: PropTypes.string.isRequired,
      shortTextfield: PropTypes.string.isRequired,
    }).isRequired,
    t: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    dispatchAddDataset: PropTypes.func.isRequired,
  };

  handleLocationInput = (event) => {
    const fileLocation = event.target.value;
    this.setState({
      fileLocation,
      defaultDatasetName: getNameFromLocation(fileLocation),
    });
  };

  handleCustomNameInput = (event) => {
    this.setState({ fileCustomName: event.target.value });
  };

  handleDescriptionInput = (event) => {
    this.setState({ fileDescription: event.target.value });
  };

  handleBrowseFileCallback = (filePaths) => {
    // currently we select only one file
    const filePath = filePaths[0];
    if (filePath) {
      this.setState({
        fileLocation: filePath,
        defaultDatasetName: getNameFromLocation(filePath),
      });
    }
  };

  handleFileSubmit = () => {
    const {
      fileCustomName,
      fileLocation,
      fileDescription,
      defaultDatasetName,
    } = this.state;
    const { dispatchAddDataset } = this.props;
    dispatchAddDataset({
      fileCustomName: fileCustomName || defaultDatasetName,
      fileLocation,
      fileDescription,
    });
  };

  resetForm = () => {
    this.setState({
      fileLocation: '',
      fileCustomName: '',
      fileDescription: '',
      defaultDatasetName: '',
    });
  };

  render() {
    const { classes, t, open, handleClose } = this.props;
    const {
      fileLocation,
      fileCustomName,
      fileDescription,
      defaultDatasetName,
    } = this.state;

    return (
      <Dialog
        open={open}
        onClose={() => {
          this.resetForm();
          handleClose();
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle id="create-new-item-form">
          {t('Add new dataset')}
        </DialogTitle>
        <DialogContent className={classes.dialogContent}>
          <div className={classes.loadDataset}>
            <TextField
              autoFocus
              margin="dense"
              id={LOAD_DATASET_FILEPATH_ID}
              label={t('Select dataset')}
              fullWidth
              onChange={this.handleLocationInput}
              value={fileLocation}
              helperText={t('(Required)')}
              required
            />
            <BrowseFileButton
              filters={[FILE_FILTERS.JSON, FILE_FILTERS.ALL]}
              onBrowseFileCallback={this.handleBrowseFileCallback}
            />
          </div>

          <TextField
            margin="dense"
            id={LOAD_DATASET_NAME_ID}
            label={t('Dataset name')}
            placeholder={defaultDatasetName}
            value={fileCustomName}
            onChange={this.handleCustomNameInput}
            fullWidth
            helperText={t('(Optional)')}
            InputLabelProps={{
              shrink: true,
            }}
          />

          <TextField
            margin="dense"
            id={LOAD_DATASET_DESCRIPTION_ID}
            label={t('Description')}
            value={fileDescription}
            multiline
            rows={4}
            rowsMax={4}
            helperText={t('(Optional)')}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button
            id={LOAD_DATASET_CANCEL_BUTTON_ID}
            onClick={() => {
              this.resetForm();
              handleClose();
            }}
            color="primary"
          >
            {t('Cancel')}
          </Button>
          <Button
            id={LOAD_DATASET_ACCEPT_ID}
            onClick={() => {
              this.handleFileSubmit();
              this.resetForm();
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
  dispatchAddDataset: loadDataset,
};

const ConnectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps,
)(LoadDatasetModal);

const StyledComponent = withStyles(styles, { withTheme: true })(
  ConnectedComponent,
);

const TranslatedComponent = withTranslation()(StyledComponent);

export default TranslatedComponent;
