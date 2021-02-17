import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { List } from 'immutable';
import MaterialTable from '@material-ui/core/Table';
import { withStyles } from '@material-ui/core/styles';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Typography from '@material-ui/core/Typography';
import { ORDER_BY } from '../../config/constants';
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
  } = props;
  const [orderBy, setOrderBy] = useState(initialOrderBy);
  const [isAsc, setIsAsc] = useState(initialIsAsc);

  const handleSortColumn = (column) => {
    if (orderBy === column) {
      setIsAsc(!isAsc);
    } else {
      setIsAsc(true);
      setOrderBy(column);
    }
  };

  const sortedRows = sortByKey(rows, orderBy, isAsc);

  return (
    <MaterialTable aria-label="table" id={id}>
      <TableHead>
        <TableRow>
          {columns.map(({ columnName, alignColumn, sortBy }) => {
            return (
              <TableCell align={alignColumn} key={columnName}>
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
                  <Typography className={classes.bold}>{columnName}</Typography>
                )}
              </TableCell>
            );
          })}
        </TableRow>
      </TableHead>
      <TableBody>
        {sortedRows.map((row) => {
          const { key, className } = row;
          return (
            <TableRow key={key} className={className}>
              {columns.map(({ field, alignField }) => {
                return (
                  <TableCell align={alignField} key={field}>
                    {row[field]}
                  </TableCell>
                );
              })}
            </TableRow>
          );
        })}
      </TableBody>
    </MaterialTable>
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
};

Table.defaultProps = {
  id: '',
  orderBy: null,
  isAsc: true,
};

const StyledComponent = withStyles(styles, { withTheme: false })(Table);

export default StyledComponent;
