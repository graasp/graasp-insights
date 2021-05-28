import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { useSelector } from 'react-redux';
import { buildEditPipelinePath } from '../../config/paths';
import LinkButton from './LinkButton';

const PipelineViewButton = ({ id, name, linkId }) => {
  const pipelines = useSelector((state) => state.pipeline.get('pipelines'));
  const { push } = useHistory();
  const { t } = useTranslation();

  const pipelineName =
    name ||
    pipelines.find(({ id: thisId }) => thisId === id)?.name ||
    t('Unknown');

  const onClick = () => push(buildEditPipelinePath(id));

  return (
    <LinkButton
      id={linkId}
      text={pipelineName}
      onClick={onClick}
      disabled={!id}
    />
  );
};

PipelineViewButton.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string,
  linkId: PropTypes.string,
};

PipelineViewButton.defaultProps = {
  name: null,
  linkId: null,
};

export default PipelineViewButton;
