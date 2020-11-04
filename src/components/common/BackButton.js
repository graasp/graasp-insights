import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { withTranslation } from 'react-i18next';
import Button from '@material-ui/core/Button';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

const BackButton = (props) => {
  const {
    history: { goBack },
    t,
    className,
    id,
  } = props;

  return (
    <Button
      variant="contained"
      color="primary"
      id={id}
      className={className}
      startIcon={<ArrowBackIcon />}
      onClick={goBack}
    >
      {t('Back')}
    </Button>
  );
};

BackButton.propTypes = {
  history: PropTypes.shape({
    goBack: PropTypes.func.isRequired,
  }).isRequired,
  t: PropTypes.func.isRequired,
  id: PropTypes.string,
  className: PropTypes.string,
};

BackButton.defaultProps = {
  className: null,
  id: null,
};

const TranslatedComponent = withTranslation()(BackButton);

export default withRouter(TranslatedComponent);
