import React from 'react';
import { withRouter } from 'react-router';

import Container from '@material-ui/core/Container';
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

import Main from './common/Main';

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

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(isAsc, orderBy) {
  return isAsc
    ? (a, b) => -descendingComparator(a, b, orderBy)
    : (a, b) => descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const Datasets = () => {
  // name column sorted ascending by default
  const [isAsc, setIsAsc] = React.useState(true);
  const [orderBy, setOrderBy] = React.useState('name');

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
        <h1>Datasets</h1>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="left">
                <TableSortLabel
                  active={orderBy === 'name'}
                  direction={orderBy === 'name' && !isAsc ? 'desc' : 'asc'}
                  onClick={() => handleSortColumn('name')}
                >
                  <strong>Name</strong>
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">
                <TableSortLabel
                  active={orderBy === 'size'}
                  direction={orderBy === 'size' && !isAsc ? 'desc' : 'asc'}
                  onClick={() => handleSortColumn('size')}
                >
                  <strong>Size</strong>
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">
                <TableSortLabel
                  active={orderBy === 'created'}
                  direction={orderBy === 'created' && !isAsc ? 'desc' : 'asc'}
                  onClick={() => handleSortColumn('created')}
                >
                  <strong>Created</strong>
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">
                <TableSortLabel
                  active={orderBy === 'lastModified'}
                  direction={
                    orderBy === 'lastModified' && !isAsc ? 'desc' : 'asc'
                  }
                  onClick={() => handleSortColumn('lastModified')}
                >
                  <strong>Last Modified</strong>
                </TableSortLabel>
              </TableCell>
              <TableCell align="right" />
            </TableRow>
          </TableHead>
          <TableBody>
            {stableSort(fakeDatasets, getComparator(isAsc, orderBy)).map(
              (dataset) => (
                <TableRow key={dataset.name}>
                  <TableCell>
                    <span style={{ fontSize: '20px' }}>{dataset.name}</span>
                    <br />
                    {dataset.description}
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
                    {!dataset.anonymized ? (
                      <IconButton
                        aria-label="anonymize"
                        onClick={() => handleAnonymize(dataset)}
                      >
                        <EqualizerIcon />
                      </IconButton>
                    ) : (
                      ''
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
              ),
            )}
          </TableBody>
        </Table>
      </Container>
    </Main>
  );
};

export default withRouter(Datasets);
