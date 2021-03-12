import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { useSelector } from 'react-redux';
import { buildDatasetPath } from '../../config/paths';
import LinkButton from './LinkButton';

const DatasetViewButton = ({ id, name }) => {
  const datasets = useSelector(({ dataset }) => dataset.get('datasets'));
  const results = useSelector(({ result }) => result.get('results'));
  const { push } = useHistory();
  const { t } = useTranslation();

  const datasetName =
    name ||
    [...datasets, ...results].find(
      ({ id: thisSourceId }) => thisSourceId === id,
    )?.name ||
    t('Unknown');

  const onClick = () => push(buildDatasetPath(id));

  return <LinkButton text={datasetName} onClick={onClick} disabled={!id} />;
};

DatasetViewButton.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string,
};

DatasetViewButton.defaultProps = {
  name: null,
};

export default DatasetViewButton;
