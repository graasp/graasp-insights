import React from 'react';
import { withRouter } from 'react-router';

import Container from '@material-ui/core/Container';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
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
    size: '413Kb',
    created: '7/13/20',
    lastModified: '7/13/20',
    anonymized: false,
  },
  {
    name: 'Animals of the world',
    description: 'Collection of all the referenced animals of world.',
    size: '409600Kb',
    created: '7/12/18',
    lastModified: '9/14/20',
    anonymized: false,
  },
  {
    name: 'Anonymized Atomic Structure',
    description: 'Anonymized version of Atomic Structure Dataset',
    size: '211Kb',
    created: '7/02/20',
    lastModified: '7/02/20',
    anonymized: true,
  },
];

const Datasets = () => {
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

  return (
    <Main content>
      <Container>
        <h1>Datasets</h1>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Name</strong>
              </TableCell>
              <TableCell align="left">
                <strong>Size</strong>
              </TableCell>
              <TableCell align="left">
                <strong>Created</strong>
              </TableCell>
              <TableCell align="left">
                <strong>Last Modified</strong>
              </TableCell>
              <TableCell align="right" />
            </TableRow>
          </TableHead>
          <TableBody>
            {fakeDatasets.map((dataset) => (
              <TableRow key={dataset.name}>
                <TableCell>
                  <span style={{ fontSize: '20px' }}>{dataset.name}</span>
                  <br />
                  {dataset.description}
                </TableCell>
                <TableCell align="left">{dataset.size}</TableCell>
                <TableCell align="left">{dataset.created}</TableCell>
                <TableCell align="left">{dataset.lastModified}</TableCell>
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
            ))}
          </TableBody>
        </Table>
      </Container>
    </Main>
  );
};

export default withRouter(Datasets);
