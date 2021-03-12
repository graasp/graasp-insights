const _ = require('lodash');

// custom merging policy for the lodash mergeWith function
// => merges type values into a list
const customizer = (objValue, srcValue, key) => {
  if (key === 'type' && !_.isPlainObject(objValue)) {
    if (!objValue) return srcValue;
    if (_.isArray(objValue) || _.isArray(srcValue)) {
      return Array.from(new Set([].concat(objValue, srcValue)));
    }
    if (objValue !== srcValue) {
      return [objValue, srcValue];
    }
  }

  return undefined;
};

const generateSchemaFromJSON = (value, requiredDepth = 1) => {
  if (_.isNull(value)) return { type: 'null' };
  if (_.isString(value)) return { type: 'string' };
  if (_.isNumber(value)) return { type: 'number' };
  if (_.isBoolean(value)) return { type: 'boolean' };
  if (_.isPlainObject(value)) {
    const properties = Object.fromEntries(
      Object.entries(value).map((entry) => [
        entry[0],
        generateSchemaFromJSON(entry[1], requiredDepth - 1),
      ]),
    );
    return {
      type: 'object',
      required: requiredDepth > 0 ? Object.keys(properties) : [],
      properties,
    };
  }
  if (_.isArray(value)) {
    // generate schema for each value in array
    const arraySchemas = value.map((arrayItem) =>
      generateSchemaFromJSON(arrayItem, requiredDepth - 1),
    );
    const types = Array.from(new Set(arraySchemas.map(({ type }) => type)));
    if (types.includes('object')) {
      // merge every generated schema into a single one
      const properties = arraySchemas
        .filter(({ type }) => type === 'object')
        .map(({ properties: subProperties }) => subProperties)
        .reduce((left, right) => _.mergeWith(left, right, customizer));

      return {
        type: 'array',
        items: {
          type: types.length > 1 ? types : types[0] || 'null',
          required: requiredDepth > 0 ? Object.keys(properties) : [],
          properties,
        },
      };
    }
    return {
      type: 'array',
      items: {
        type: types.length > 1 ? types : types[0] || 'null',
      },
    };
  }
  return {};
};

module.exports = generateSchemaFromJSON;
