import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { withRouter } from 'react-router';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import DatabaseEditor from './DatabaseEditor';
import Main from '../common/Main';
import Banner from '../common/Banner';

// eslint-disable-next-line react/prefer-stateless-function
export class DeveloperScreen extends Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
    theme: PropTypes.shape({
      direction: PropTypes.string.isRequired,
    }).isRequired,
    history: PropTypes.shape({
      replace: PropTypes.func.isRequired,
    }).isRequired,
    i18n: PropTypes.shape({
      changeLanguage: PropTypes.func.isRequired,
    }).isRequired,
  };

  render() {
    const { t } = this.props;

    return (
      <Main>
        <div>
          <Typography variant="h4">{t('Developer')}</Typography>
          <br />
          <Banner
            text={t(
              'Danger Zone! Proceed with caution as changes to this section might lead to data loss.',
            )}
            type="error"
          />
          <DatabaseEditor />
        </div>
      </Main>
    );
  }
}

const TranslatedComponent = withTranslation()(DeveloperScreen);

export default withRouter(TranslatedComponent);
