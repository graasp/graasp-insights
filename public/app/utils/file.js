const fs = require('fs');

const getFileStats = (filepath) => {
  // get file data
  const stats = fs.statSync(filepath);
  const { size, ctimeMs, mtimeMs } = stats;
  const createdAt = ctimeMs;
  const lastModified = mtimeMs;
  const sizeInKiloBytes = size / 1000;

  return { createdAt, lastModified, sizeInKiloBytes };
};

module.exports = { getFileStats };
