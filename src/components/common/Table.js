import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { List } from 'immutable';
import MaterialTable from '@material-ui/core/Table';
import { withStyles } from '@material-ui/core/styles';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import TablePagination from '@material-ui/core/TablePagination';
import Typography from '@material-ui/core/Typography';
import {
  DEFAULT_ROWS_PER_PAGE,
  ORDER_BY,
  RADIX_DECIMAL,
  ROWS_PER_PAGE_OPTIONS,
} from '../../config/constants';
import { sortByKey } from '../../utils/sorting';

const styles = () => ({
  bold: {
    fontWeight: 'bold',
  },
});

const Table = (props) => {
  const {
    columns,
    rows,
    classes,
    id,
    orderBy: initialOrderBy,
    isAsc: initialIsAsc,
    rowsPerPage: initialRowsPerPage,
  } = props;
  const [orderBy, setOrderBy] = useState(initialOrderBy);
  const [isAsc, setIsAsc] = useState(initialIsAsc);
  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);
  const [page, setPage] = useState(0);

  const handleSortColumn = (column) => {
    if (orderBy === column) {
      setIsAsc(!isAsc);
    } else {
      setIsAsc(true);
      setOrderBy(column);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, RADIX_DECIMAL));
    setPage(0);
  };

  const sortedRows = sortByKey(rows, orderBy, isAsc);
  const pageRows = sortedRows.slice(
    page * rowsPerPage,
    (page + 1) * rowsPerPage,
  );

  const sortRowsPipeline = (rowsPipeline) => {
    return rowsPipeline.map((row) => {
      const { key, className } = row;
      return (
        <TableRow key={key} className={className}>
          {columns
            .filter(({ field }) => field)
            .map(({ field, alignField, fieldColSpan }) => {
              return (
                <TableCell
                  align={alignField}
                  key={field}
                  colSpan={fieldColSpan}
                >
                  {row[field]}
                </TableCell>
              );
            })}
        </TableRow>
      );
    });
  };

  return (
    <div>
      <TableContainer>
        <MaterialTable aria-label="table" id={id}>
          <TableHead>
            <TableRow>
              {columns.map(({ columnName, alignColumn, sortBy, colSpan }) => {
                return (
                  <TableCell
                    align={alignColumn}
                    key={columnName}
                    colSpan={colSpan}
                  >
                    {sortBy ? (
                      <TableSortLabel
                        active={orderBy === sortBy}
                        direction={
                          orderBy === sortBy && !isAsc
                            ? ORDER_BY.DESC
                            : ORDER_BY.ASC
                        }
                        onClick={() => {
                          handleSortColumn(sortBy);
                        }}
                      >
                        <Typography className={classes.bold}>
                          {columnName}
                        </Typography>
                      </TableSortLabel>
                    ) : (
                      <Typography className={classes.bold}>
                        {columnName}
                      </Typography>
                    )}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {pageRows.map((row) => {
              const { key, className, resultPipeline, open } = row;
              return (
                <>
                  <TableRow key={key} className={className}>
                    {columns
                      .filter(({ field }) => field)
                      .map(({ field, alignField, fieldColSpan }) => {
                        return (
                          <TableCell
                            align={alignField}
                            key={field}
                            colSpan={fieldColSpan}
                          >
                            {row[field]}
                          </TableCell>
                        );
                      })}
                  </TableRow>
                  {open && resultPipeline ? (
                    sortRowsPipeline(resultPipeline)
                  ) : (
                    <></>
                  )}
                </>
              );
            })}
          </TableBody>
        </MaterialTable>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
        component="div"
        count={rows.size}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </div>
  );
};

Table.propTypes = {
  columns: PropTypes.instanceOf(Array).isRequired,
  rows: PropTypes.instanceOf(List).isRequired,
  classes: PropTypes.shape({
    bold: PropTypes.string.isRequired,
  }).isRequired,
  id: PropTypes.string,
  orderBy: PropTypes.string,
  isAsc: PropTypes.bool,
  rowsPerPage: PropTypes.number,
};

Table.defaultProps = {
  id: '',
  orderBy: null,
  isAsc: true,
  rowsPerPage: DEFAULT_ROWS_PER_PAGE,
};

const StyledComponent = withStyles(styles, { withTheme: false })(Table);

export default StyledComponent;
