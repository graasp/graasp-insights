const fs = require('fs');
const parse = require('csv-parse/lib/sync');
const stringify = require('csv-stringify/lib/sync');

const getFileStats = (filepath) => {
  // get file data
  const stats = fs.statSync(filepath);
  const { size, ctimeMs, mtimeMs } = stats;
  const createdAt = ctimeMs;
  const lastModified = mtimeMs;
  const sizeInKiloBytes = size / 1000;

  return { createdAt, lastModified, sizeInKiloBytes };
};

const convertCSVToJSON = (csv) => {
  const records = parse(csv, {
    columns: true,
    skip_empty_lines: true,
  });
  return records;
};

const convertJSONToCSV = (json) => {
  const converted = stringify(json, {
    header: true,
  });

  return converted;
};

module.exports = { getFileStats, convertCSVToJSON, convertJSONToCSV };
