import React, { useState } from 'react';
import { withRouter } from 'react-router';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';

import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import IconButton from '@material-ui/core/IconButton';
import PublishIcon from '@material-ui/icons/Publish';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';

import theme from '../theme';
import Main from './common/Main';
import { DATASETS_TABLE_COLUMNS, ORDER_BY } from '../config/constants';
import { sortByKey } from '../utils/sorting';

const useStyles = makeStyles({
  addButton: {
    color: theme.palette.secondary.main,
    backgroundColor: theme.palette.primary.main,
    position: 'absolute',
    right: '16px',
    bottom: '16px',
    '&:hover, &.Mui-focusVisible': {
      backgroundColor: theme.palette.primary.main,
    },
  },
  columnName: {
    fontWeight: 'bold',
  },
});

// fake dataset that will be deleted later
const fakeDatasets = [
  {
    name: 'Atomic Structure',
    description: 'Atomic Structure Dataset of students during two months',
    size: 413,
    created: '7/13/20',
    lastModified: '7/13/20',
    anonymized: false,
  },
  {
    name: 'Animals of the world',
    description: 'Collection of all the referenced animals of world.',
    size: 409600,
    created: '7/12/18',
    lastModified: '9/14/20',
    anonymized: false,
  },
  {
    name: 'Anonymized Atomic Structure',
    description: 'Anonymized version of Atomic Structure Dataset',
    size: 211,
    created: '7/02/20',
    lastModified: '7/02/20',
    anonymized: true,
  },
];

const Datasets = () => {
  const classes = useStyles();
  const { t } = useTranslation();

  // name column sorted ascending by default
  const [isAsc, setIsAsc] = useState(true);
  const [orderBy, setOrderBy] = useState(DATASETS_TABLE_COLUMNS.NAME);

  const handlePublish = () => {
    // TODO: implement publish functionality
  };

  const handleAnonymize = () => {
    // TODO: implement anonymize functionality
  };

  const handleEdit = () => {
    // TODO: implement edit functionality
  };

  const handleDelete = () => {
    // TODO: implement delete functionality
  };

  const handleAdd = () => {
    // TODO: implement add functionality
  };

  const handleSortColumn = (column) => {
    if (orderBy === column) {
      setIsAsc(!isAsc);
    } else {
      setOrderBy(column);
      setIsAsc(true);
    }
  };

  return (
    <Main content>
      <Container>
        <h1>{t('Datasets')}</h1>
        <Table aria-label="table of datasets">
          <TableHead>
            <TableRow>
              <TableCell align="left">
                <TableSortLabel
                  active={orderBy === DATASETS_TABLE_COLUMNS.NAME}
                  direction={
                    orderBy === DATASETS_TABLE_COLUMNS.NAME && !isAsc
                      ? ORDER_BY.DESC
                      : ORDER_BY.ASC
                  }
                  onClick={() => {
                    handleSortColumn(DATASETS_TABLE_COLUMNS.NAME);
                  }}
                >
                  <Typography className={classes.columnName}>
                    {t('Name')}
                  </Typography>
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">
                <TableSortLabel
                  active={orderBy === DATASETS_TABLE_COLUMNS.SIZE}
                  direction={
                    orderBy === DATASETS_TABLE_COLUMNS.SIZE && !isAsc
                      ? ORDER_BY.DESC
                      : ORDER_BY.ASC
                  }
                  onClick={() => {
                    handleSortColumn(DATASETS_TABLE_COLUMNS.SIZE);
                  }}
                >
                  <Typography className={classes.columnName}>
                    {t('Size')}
                  </Typography>
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">
                <TableSortLabel
                  active={orderBy === DATASETS_TABLE_COLUMNS.CREATED}
                  direction={
                    orderBy === DATASETS_TABLE_COLUMNS.CREATED && !isAsc
                      ? ORDER_BY.DESC
                      : ORDER_BY.ASC
                  }
                  onClick={() => {
                    handleSortColumn(DATASETS_TABLE_COLUMNS.CREATED);
                  }}
                >
                  <Typography className={classes.columnName}>
                    {t('Created')}
                  </Typography>
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">
                <TableSortLabel
                  active={orderBy === DATASETS_TABLE_COLUMNS.LAST_MODIFIED}
                  direction={
                    orderBy === DATASETS_TABLE_COLUMNS.LAST_MODIFIED && !isAsc
                      ? ORDER_BY.DESC
                      : ORDER_BY.ASC
                  }
                  onClick={() => {
                    handleSortColumn(DATASETS_TABLE_COLUMNS.LAST_MODIFIED);
                  }}
                >
                  <Typography className={classes.columnName}>
                    {t('Last Modified')}
                  </Typography>
                </TableSortLabel>
              </TableCell>
              <TableCell align="right" />
            </TableRow>
          </TableHead>
          <TableBody>
            {sortByKey(fakeDatasets, orderBy, isAsc).map((dataset) => (
              <TableRow key={dataset.name}>
                <TableCell>
                  <Typography variant="h6">{dataset.name}</Typography>
                  <Typography>{dataset.description}</Typography>
                </TableCell>
                <TableCell align="right">{`${dataset.size}KB`}</TableCell>
                <TableCell align="right">{dataset.created}</TableCell>
                <TableCell align="right">{dataset.lastModified}</TableCell>
                <TableCell align="right">
                  <IconButton
                    aria-label="publish"
                    onClick={() => handlePublish(dataset)}
                  >
                    <PublishIcon />
                  </IconButton>
                  {!dataset.anonymized && (
                    <IconButton
                      aria-label="anonymize"
                      onClick={() => handleAnonymize(dataset)}
                    >
                      <EqualizerIcon />
                    </IconButton>
                  )}
                  <IconButton
                    aria-label="edit"
                    onClick={() => handleEdit(dataset)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    aria-label="delete"
                    onClick={() => handleDelete(dataset)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <IconButton
          variant="contained"
          aria-label="add"
          className={classes.addButton}
          onClick={handleAdd}
        >
          <AddIcon />
        </IconButton>
      </Container>
    </Main>
  );
};

export default withRouter(Datasets);
