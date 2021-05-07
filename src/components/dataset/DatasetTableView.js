import React from 'react';
import PropTypes from 'prop-types';
import { List } from 'immutable';
import Table from '../common/Table';

const DatasetTableView = ({ content, id }) => {
  if (!content) {
    return null;
  }

  const json = JSON.parse(content);
  const uniqueKeys = json
    .map(Object.keys)
    .reduce((left, right) => [...new Set([...left, ...right])], []);

  const columns = uniqueKeys.map((key) => {
    return {
      columnName: key,
      sortBy: key,
      field: key,
    };
  });

  const rows = List(
    json.map((row) => {
      return Object.fromEntries(
        Object.entries(row).map(([key, value]) => {
          const formattedValue =
            typeof value === 'object' ? JSON.stringify(value) : value;
          return [key, formattedValue];
        }),
      );
    }),
  );

  return <Table id={id} rows={rows} columns={columns} />;
};

DatasetTableView.propTypes = {
  content: PropTypes.string.isRequired,
  id: PropTypes.string,
};

DatasetTableView.defaultProps = {
  id: null,
};

export default DatasetTableView;
