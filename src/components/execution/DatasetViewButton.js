import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { buildDatasetPath } from '../../config/paths';
import LinkButton from './LinkButton';
import { openDataset } from '../../actions';

const DatasetViewButton = ({ id, name }) => {
  const datasets = useSelector(({ dataset }) => dataset.get('datasets'));
  const results = useSelector(({ result }) => result.get('results'));
  const { push } = useHistory();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const dataset = [...datasets, ...results].find(
    ({ id: thisSourceId }) => thisSourceId === id,
  );

  const datasetName = name || dataset?.name || t('Unknown');

  const onClick = () =>
    dispatch(
      openDataset({
        dataset,
        onConfirm: () => push(buildDatasetPath(id)),
      }),
    );

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
