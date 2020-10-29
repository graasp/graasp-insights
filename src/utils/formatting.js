// takes fileSize in KBs with 3 decimals places, and formats them
// eslint-disable-next-line import/prefer-default-export
export const formatFileSize = (sizeInKb) => {
  // if size < 100, display size in KBs to 2dps, e.g. 19.432 --> '19.43KB'
  if (sizeInKb < 100) {
    return `${sizeInKb.toFixed(2)}KB`;
  }
  // if size < 999.5, display size in KBs rounded to nearest integer, e.g. 431.855 --> '432KB'
  if (sizeInKb < 999.5) {
    return `${Math.round(sizeInKb)}KB`;
  }
  // if size >= 999.5, display size in MBs to 2dps, e.g. 12521.482 --> 12.52MB'
  return `${(Math.round(sizeInKb) / 1000).toFixed(2)}MB`;
};