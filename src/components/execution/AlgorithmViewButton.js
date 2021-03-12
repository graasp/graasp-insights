import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { useSelector } from 'react-redux';
import { buildEditAlgorithmPath } from '../../config/paths';
import LinkButton from './LinkButton';

const AlgorithmViewButton = ({ id, name }) => {
  const algorithms = useSelector(({ algorithms: a }) => a.get('algorithms'));
  const { push } = useHistory();
  const { t } = useTranslation();

  const algorithmName =
    name ||
    algorithms.find(({ id: thisId }) => thisId === id)?.name ||
    t('Unknown');

  const onClick = () => push(buildEditAlgorithmPath(id));

  return <LinkButton text={algorithmName} onClick={onClick} disabled={!id} />;
};

AlgorithmViewButton.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string,
};

AlgorithmViewButton.defaultProps = {
  name: null,
};

export default AlgorithmViewButton;
