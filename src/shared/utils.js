const generateFieldSelector = (schema, expandUntilDepth = 1) => {
  const generate = (field, depth) => {
    const { type, properties, items } = field;
    const expanded = depth <= expandUntilDepth;
    switch (type) {
      case 'object':
        // if we have an object, properties contains the information for each key
        return {
          ...field,
          selected: false,
          expanded,
          properties: Object.fromEntries(
            Object.entries(properties).map(([key, value]) => [
              key,
              generate(value, depth + 1),
            ]),
          ),
        };
      case 'array': {
        // if we have an array, items could either be an array of subschemas or one single schema for every element
        if (Array.isArray(items)) {
          return {
            ...field,
            selected: false,
            expanded,
            items: items.map((obj) => generate(obj, depth + 1)),
          };
        }
        const { type: subType, properties: subProperties } = items;
        if (subType === 'object') {
          return {
            ...field,
            selected: false,
            expanded,
            items: {
              ...items,
              properties: Object.fromEntries(
                Object.entries(subProperties).map(([key, value]) => [
                  key,
                  generate(value, depth + 1),
                ]),
              ),
            },
          };
        }
        return { ...field, selected: false, expanded };
      }
      default:
        // if neither object nor array, then no more nesting/children
        return { ...field, selected: false, expanded };
    }
  };

  return {
    ...schema,
    properties: Object.fromEntries(
      Object.entries(schema.properties).map(([key, value]) => [
        key,
        generate(value, 1),
      ]),
    ),
  };
};

module.exports = {
  generateFieldSelector,
};
