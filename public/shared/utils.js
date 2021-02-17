/* eslint-disable prefer-object-spread */
/**
 * Set selected and expanded values to each property of a schema.
 * Selected (boolean) indicates if the property is selected.
 * Expanded (boolean) indicates if the property is expanded.
 * @param {object} schema - the schema
 * @param {boolean} selected - whether the fields should be all selected or not (undefined to ignore)
 * @param {boolean} expandUntilDepth - depth until which the property is expanded by default (undefined to ignore)
 * @return {object} - schema with selected and expanded values for each property
 */
const setFieldSelectorAttributes = (schema, selected, expandUntilDepth) => {
  const setField = (field, depth) => {
    const { type, properties, items } = field;

    let newProperties;
    let newItems;
    if (type && type.includes('object')) {
      // if we have an object, the 'properties' field contains the information for each key
      newProperties = Object.fromEntries(
        Object.entries(properties).map((entry) => [
          entry[0],
          setField(entry[1], depth + 1),
        ]),
      );
    }

    if (type && type.includes('array')) {
      // if we have an array, items could either be an array of subschemas or one single schema for every element
      if (Array.isArray(items)) {
        newItems = items.map((obj) => setField(obj, depth + 1));
      }
      const { type: subType, properties: subProperties } = items;
      if (subType === 'object') {
        newItems = Object.assign({}, items, {
          properties: Object.fromEntries(
            Object.entries(subProperties).map((entry) => [
              entry[0],
              setField(entry[1], depth + 1),
            ]),
          ),
        });
      }
    }

    // copy
    const newField = Object.assign({}, field);

    if (selected !== undefined) {
      newField.selected = selected;
    }
    if (expandUntilDepth !== undefined) {
      newField.expanded = depth <= expandUntilDepth;
    }
    if (newProperties) {
      newField.properties = newProperties;
    }
    if (newItems) {
      newField.items = newItems;
    }

    return newField;
  };

  return Object.assign({}, schema, {
    properties: Object.fromEntries(
      Object.entries(schema.properties).map((entry) => [
        entry[0],
        setField(entry[1], 1),
      ]),
    ),
  });
};

const fieldSelectorUnselectAll = (schema) =>
  setFieldSelectorAttributes(schema, false);

module.exports = {
  setFieldSelectorAttributes,
  fieldSelectorUnselectAll,
};
