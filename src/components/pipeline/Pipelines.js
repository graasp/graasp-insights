import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import Tooltip from '@material-ui/core/Tooltip';
import LaunchIcon from '@material-ui/icons/Launch';

import Main from '../common/Main';
import Table from '../common/Table';
import {
  PIPELINE_DELETE_BUTTON_CLASS,
  PIPELINE_EDIT_BUTTON_CLASS,
  PIPELINE_EXECUTION_BUTTON_CLASS,
  PIPELINE_NAME_CLASS,
  PIPELINE_TABLE_ID,
  PIPELINE_ADD_BUTTON_ID,
  buildPipelineRowClass,
} from '../../config/selectors';

import { clearPipeline, getPipelines, deletePipeline } from '../../actions';
import {
  EXECUTIONS_PATH,
  buildEditPipelinePath,
  ADD_PIPELINE_PATH,
} from '../../config/paths';

const styles = (theme) => ({
  content: {
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
  },
  addButton: {
    color: theme.palette.secondary.main,
    backgroundColor: theme.palette.primary.main,
    position: 'fixed',
    right: theme.spacing(2),
    bottom: theme.spacing(2),
    '&:hover, &.Mui-focusVisible': {
      backgroundColor: theme.palette.primary.main,
    },
  },
});

const Pipelines = (props) => {
  const {
    t,
    classes,
    history: { push },
  } = props;
  const dispatch = useDispatch();
  const pipelines = useSelector((state) => state.pipeline.get('pipelines'));

  useEffect(() => {
    dispatch(getPipelines());
    // clean-up function
    return () => {
      dispatch(clearPipeline());
    };
  }, [dispatch]);

  const handleAdd = () => {
    push(ADD_PIPELINE_PATH);
  };

  const handleDelete = ({ id, name }) => {
    dispatch(deletePipeline({ id, name }));
  };

  const handleEdit = (id) => {
    push(buildEditPipelinePath(id));
  };

  const handleExecution = () => {
    push(EXECUTIONS_PATH);
  };

  const columns = [
    {
      columnName: t('Pipeline'),
      sortBy: 'name',
      field: 'pipeline',
      alignColumn: 'left',
      alignField: 'left',
    },
    {
      columnName: t('Quick Actions'),
      field: 'quickActions',
      alignColumn: 'right',
      alignField: 'right',
    },
  ];

  const rows = pipelines.map((pipeline) => {
    const { id, name } = pipeline;
    const quickActions = [
      <Tooltip title={t('Edit')} key="edit">
        <IconButton
          aria-label="edit"
          onClick={() => handleEdit(id)}
          className={PIPELINE_EDIT_BUTTON_CLASS}
        >
          <EditIcon />
        </IconButton>
      </Tooltip>,
      <Tooltip title={t('Execute')} key="execute">
        <IconButton
          aria-label="edit"
          onClick={() => handleExecution()}
          className={PIPELINE_EXECUTION_BUTTON_CLASS}
        >
          <LaunchIcon />
        </IconButton>
      </Tooltip>,
      <Tooltip title={t('Delete')} key="delete">
        <span>
          <IconButton
            aria-label="delete"
            onClick={() => handleDelete({ id, name })}
            className={PIPELINE_DELETE_BUTTON_CLASS}
          >
            <DeleteIcon />
          </IconButton>
        </span>
      </Tooltip>,
    ];
    return {
      key: id,
      className: buildPipelineRowClass(name),
      name,
      pipeline: [
        <Typography
          variant="subtitle1"
          key="name"
          className={PIPELINE_NAME_CLASS}
        >
          {name}
        </Typography>,
      ],
      quickActions,
    };
  });

  return (
    <Main>
      <Container className={classes.content}>
        <Typography variant="h4">{t('Pipelines')}</Typography>
        <Table
          columns={columns}
          rows={rows}
          id={PIPELINE_TABLE_ID}
          isAsc={false}
        />
      </Container>
      <IconButton
        variant="contained"
        className={classes.addButton}
        onClick={handleAdd}
        id={PIPELINE_ADD_BUTTON_ID}
      >
        <AddIcon />
      </IconButton>
    </Main>
  );
};

Pipelines.propTypes = {
  t: PropTypes.func.isRequired,
  classes: PropTypes.shape({
    content: PropTypes.string.isRequired,
    addButton: PropTypes.string.isRequired,
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

const StyledComponent = withStyles(styles)(Pipelines);

const TranslatedComponent = withTranslation()(StyledComponent);

export default withRouter(TranslatedComponent);
