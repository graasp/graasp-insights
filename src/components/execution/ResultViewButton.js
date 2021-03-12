import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { useSelector } from 'react-redux';
import { buildResultPath } from '../../config/paths';
import LinkButton from './LinkButton';

const ResultViewButton = ({ id, name }) => {
  const results = useSelector(({ result }) => result.get('results'));
  const { push } = useHistory();
  const { t } = useTranslation();

  const resultName =
    name ||
    results.find(({ id: thisResultId }) => thisResultId === id)?.name ||
    t('Unknown');

  const onClick = () => push(buildResultPath(id));

  return <LinkButton text={resultName} onClick={onClick} disabled={!id} />;
};

ResultViewButton.propTypes = {
  name: PropTypes.string,
  id: PropTypes.string.isRequired,
};

ResultViewButton.defaultProps = {
  name: null,
};

export default ResultViewButton;
