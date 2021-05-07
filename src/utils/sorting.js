/**
 * Compares two objects by some key in descending order.
 *
 * @param {object} a - the first compared object
 * @param {object} b - the second compared object
 * @param {string} key - key by which the objects are compared
 * @return {int} 1 if a < b, 0 if a = b and -1 if a > b
 */
const descendingComparator = (a, b, key) => {
  if (!a[key]) return 1;
  if (!b[key]) return -1;

  if (b[key] < a[key]) {
    return -1;
  }
  if (b[key] > a[key]) {
    return 1;
  }
  return 0;
};

/**
 * Creates a comparator depending on the ascending order
 *
 * @param {boolean} isAsc - the comparison order
 * @param {string} key - key by which the objects are compared
 * @return {function(object, object, string)} a comparator
 */
const getComparator = (isAsc, key) => {
  return isAsc
    ? (a, b) => -descendingComparator(a, b, key)
    : (a, b) => descendingComparator(a, b, key);
};

/**
 * Sorts an array of objects by some sorting key
 *
 * @param {array} array - array of objects we want to sort
 * @param {boolean} isAsc - whether the comparison order is ascending
 * @param {string} key - key by which the objects are compared
 * @return {array} the sorted array
 */
const sortByKey = (array, key, isAsc = true) => {
  if (!key) return array;
  // copy the array so that the original doesn't get modified
  const arrayCopy = array.slice();
  const comparator = getComparator(isAsc, key);

  return arrayCopy.sort(comparator);
};

// eslint-disable-next-line import/prefer-default-export
export { sortByKey };
