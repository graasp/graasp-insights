/**
 * Add selected and expanded values to each property of a schema.
 * Selected (boolean) indicates if the property is selected.
 * Expanded (boolean) indicates if the property is expanded.
 * @param {object} schema - the schema
 * @param {boolean} expandUntilDepth - depth until which the property is expanded by default
 * @return {object} - schema with selected and expanded values for each property
 */
const generateFieldSelector = (schema, expandUntilDepth = 1) => {
  const generate = (field, depth) => {
    const { type, properties, items } = field;
    const expanded = depth <= expandUntilDepth;
    switch (type) {
      case 'object':
        // if we have an object, the 'properties' field contains the information for each key
        return Object.assign(field, {
          selected: false,
          expanded,
          properties: Object.fromEntries(
            Object.entries(properties).map((entry) => [
              entry[0],
              generate(entry[1], depth + 1),
            ]),
          ),
        });
      case 'array': {
        // if we have an array, items could either be an array of subschemas or one single schema for every element
        if (Array.isArray(items)) {
          return Object.assign(field, {
            selected: false,
            expanded,
            items: items.map((obj) => generate(obj, depth + 1)),
          });
        }
        const { type: subType, properties: subProperties } = items;
        if (subType === 'object') {
          return Object.assign(field, {
            selected: false,
            expanded,
            items: Object.assign(items, {
              properties: Object.fromEntries(
                Object.entries(subProperties).map((entry) => [
                  entry[0],
                  generate(entry[1], depth + 1),
                ]),
              ),
            }),
          });
        }
        return Object.assign(field, { selected: false, expanded });
      }
      default:
        // if neither object nor array, then no more nesting/children
        return Object.assign(field, { selected: false, expanded });
    }
  };

  return Object.assign(schema, {
    properties: Object.fromEntries(
      Object.entries(schema.properties).map((entry) => [
        entry[0],
        generate(entry[1], 1),
      ]),
    ),
  });
};

/**
 * Recursively unselect every field from a schema.
 * @param {object} schema - the schema
 * @return {object} - schema with all fields unselected
 */
const fieldSelectorUnselectAll = (schema) => {
  const unselectField = (field) => {
    const { type, properties, items } = field;
    if (type === 'object') {
      return Object.assign(field, {
        selected: false,
        properties: Object.fromEntries(
          Object.entries(properties).map((entry) => [
            entry[0],
            unselectField(entry[1]),
          ]),
        ),
      });
    }

    if (type === 'array') {
      if (Array.isArray(items)) {
        return Object.assign(field, {
          selected: false,
          items: items.map(unselectField),
        });
      }

      if (items?.type === 'object') {
        return Object.assign(field, {
          selected: false,
          items: Object.assign(items, {
            properties: Object.fromEntries(
              Object.entries(items.properties).map((entry) => [
                entry[0],
                unselectField(entry[1]),
              ]),
            ),
          }),
        });
      }
    }
    return Object.assign(field, { selected: false });
  };

  return Object.assign(schema, {
    properties: Object.fromEntries(
      Object.entries(schema.properties).map((entry) => [
        entry[0],
        unselectField(entry[1]),
      ]),
    ),
  });
};

module.exports = {
  generateFieldSelector,
  fieldSelectorUnselectAll,
};
