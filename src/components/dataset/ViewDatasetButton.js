import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import CodeIcon from '@material-ui/icons/Code';
import Tooltip from '@material-ui/core/Tooltip';
import { buildDatasetPath } from '../../config/paths';
import { buildDatasetsListViewButtonClass } from '../../config/selectors';
import { openDataset } from '../../actions';

class ViewDatasetButton extends Component {
  static propTypes = {
    dispatchOpenDataset: PropTypes.func.isRequired,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
    dataset: PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }).isRequired,
    t: PropTypes.func.isRequired,
  };

  handleView = () => {
    const {
      history: { push },
      dataset,
      dispatchOpenDataset,
    } = this.props;

    dispatchOpenDataset({
      dataset,
      onConfirm: () => push(buildDatasetPath(dataset.id)),
    });
  };

  render() {
    const { t, dataset } = this.props;
    const { name } = dataset;
    return (
      <Tooltip title={t('View dataset')}>
        <IconButton
          className={buildDatasetsListViewButtonClass(name)}
          aria-label="view"
          onClick={() => this.handleView()}
        >
          <CodeIcon />
        </IconButton>
      </Tooltip>
    );
  }
}

const mapDispatchToProps = {
  dispatchOpenDataset: openDataset,
};

const ConnectedComponent = connect(null, mapDispatchToProps)(ViewDatasetButton);
const TranslatedComponent = withTranslation()(ConnectedComponent);

export default withRouter(TranslatedComponent);
