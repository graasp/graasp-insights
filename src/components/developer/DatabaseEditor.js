import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import ReactJson from 'react-json-view';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { withTranslation } from 'react-i18next';
import { getDatabase, setSampleDatabase, setDatabase } from '../../actions';
import Loader from '../common/Loader';
import { DATASETS_COLLECTION } from '../../shared/constants';

export class DatabaseEditor extends Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
    dispatchGetDatabase: PropTypes.func.isRequired,
    dispatchSetSampleDatabase: PropTypes.func.isRequired,
    dispatchSetDatabase: PropTypes.func.isRequired,
    database: PropTypes.shape({
      [DATASETS_COLLECTION]: PropTypes.arrayOf(PropTypes.object).isRequired,
    }),
  };

  static defaultProps = {
    database: {},
  };

  componentDidMount() {
    const { dispatchGetDatabase } = this.props;
    dispatchGetDatabase();
  }

  handleEdit = ({ updated_src: updatedSrc }) => {
    const { dispatchSetDatabase } = this.props;
    dispatchSetDatabase(updatedSrc);
  };

  handleUseSampleDatabase = () => {
    const { dispatchSetSampleDatabase } = this.props;
    dispatchSetSampleDatabase();
  };

  render() {
    const { database, t } = this.props;

    if (!database) {
      return <Loader />;
    }

    if (_.isEmpty(database)) {
      return <p>{t('The database is empty.')}</p>;
    }

    return (
      <div>
        <Typography variant="h6">{t('Manually Edit the Database')}</Typography>
        <ReactJson
          collapsed={1}
          src={database}
          onEdit={this.handleEdit}
          onAdd={this.handleEdit}
          onDelete={this.handleEdit}
        />
        <br />
        <Button
          variant="contained"
          onClick={this.handleUseSampleDatabase}
          color="primary"
        >
          {t('Use Sample Database')}
        </Button>
      </div>
    );
  }
}

const mapStateToProps = ({ developer }) => ({
  database: developer.get('database'),
});

const mapDispatchToProps = {
  dispatchGetDatabase: getDatabase,
  dispatchSetSampleDatabase: setSampleDatabase,
  dispatchSetDatabase: setDatabase,
};

const TranslatedComponent = withTranslation()(DatabaseEditor);
const ConnectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps,
)(TranslatedComponent);

export default ConnectedComponent;
