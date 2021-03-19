import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { makeStyles, Typography } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import { DEFAULT_LOCALE_DATE } from '../../config/constants';
import AlgorithmViewButton from './AlgorithmViewButton';
import DatasetViewButton from './DatasetViewButton';
import ResultViewButton from './ResultViewButton';
import EditParametersForm from '../parameter/EditParametersForm';
import { EXECUTION_VIEW_TABLE_ID } from '../../config/selectors';

const useStyles = makeStyles((theme) => ({
  parameters: {
    marginTop: theme.spacing(2),
  },
}));

function ExecutionInformationTable() {
  const classes = useStyles();
  const { t } = useTranslation();
  const execution = useSelector(({ executions }) => executions.get('current'));

  const dataset = execution.get('source') || {};
  // eslint-disable-next-line react/jsx-props-no-spreading
  const datasetButton = <DatasetViewButton {...dataset} />;

  const algorithm = execution.get('algorithm') || {};
  // eslint-disable-next-line react/jsx-props-no-spreading
  const algorithmButton = <AlgorithmViewButton {...algorithm} />;

  const result = execution.get('result') || {};
  // eslint-disable-next-line react/jsx-props-no-spreading
  const resultButton = <ResultViewButton {...result} />;

  const params = execution.get('parameters');
  const parameters = params?.length ? (
    <EditParametersForm
      parameters={params}
      className={classes.parameters}
      disabled
    />
  ) : null;

  return (
    <>
      <Typography variant="h5">{t('Information')}</Typography>
      <TableContainer id={EXECUTION_VIEW_TABLE_ID} component={Paper}>
        <Table aria-label="simple table">
          <TableBody>
            <TableRow>
              <TableCell component="th" scope="row">
                {t('Dataset')}
              </TableCell>
              <TableCell>{datasetButton}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                {t('Algorithm')}
              </TableCell>
              <TableCell>{algorithmButton}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                {t('Result')}
              </TableCell>
              <TableCell>{resultButton}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                {t('Executed At')}
              </TableCell>
              <TableCell>
                {new Date(execution.get('executedAt')).toLocaleString(
                  DEFAULT_LOCALE_DATE,
                )}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      {parameters}
    </>
  );
}

export default ExecutionInformationTable;
