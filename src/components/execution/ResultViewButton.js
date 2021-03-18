import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { buildResultPath } from '../../config/paths';
import LinkButton from './LinkButton';
import { openDataset } from '../../actions';

const ResultViewButton = ({ id, name }) => {
  const results = useSelector(({ result }) => result.get('results'));
  const { push } = useHistory();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const result = results.find(({ id: thisResultId }) => thisResultId === id);

  const resultName = name || result?.name || t('Unknown');

  const onClick = () =>
    dispatch(
      openDataset({
        dataset: result,
        onConfirm: () => push(buildResultPath(id)),
      }),
    );

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
