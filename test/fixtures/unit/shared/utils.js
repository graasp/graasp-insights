const setFieldSelectorAttributesData = {
  input: {
    type: 'object',
    properties: {
      prop1: {
        type: 'object',
        properties: {
          objsubprop1: { type: 'string' },
          objsubprop2: { type: 'number' },
        },
      },
      prop2: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            arrsubprop1: { type: 'string' },
            arrsubprop2: { type: 'number' },
          },
        },
      },
      prop3: {
        type: 'array',
        items: { type: 'string' },
      },
      prop4: { type: 'string' },
      prop5: { type: 'number' },
      prop6: {},
    },
  },
  outputAllUnselectedDepth1: {
    type: 'object',
    properties: {
      prop1: {
        type: 'object',
        properties: {
          objsubprop1: { type: 'string', selected: false, expanded: false },
          objsubprop2: { type: 'number', selected: false, expanded: false },
        },
        selected: false,
        expanded: true,
      },
      prop2: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            arrsubprop1: { type: 'string', selected: false, expanded: false },
            arrsubprop2: { type: 'number', selected: false, expanded: false },
          },
        },
        selected: false,
        expanded: true,
      },
      prop3: {
        type: 'array',
        items: { type: 'string' },
        selected: false,
        expanded: true,
      },
      prop4: { type: 'string', selected: false, expanded: true },
      prop5: { type: 'number', selected: false, expanded: true },
      prop6: { selected: false, expanded: true },
    },
  },
  outputAllUnselectedDepth2: {
    type: 'object',
    properties: {
      prop1: {
        type: 'object',
        properties: {
          objsubprop1: { type: 'string', selected: false, expanded: true },
          objsubprop2: { type: 'number', selected: false, expanded: true },
        },
        selected: false,
        expanded: true,
      },
      prop2: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            arrsubprop1: { type: 'string', selected: false, expanded: true },
            arrsubprop2: { type: 'number', selected: false, expanded: true },
          },
        },
        selected: false,
        expanded: true,
      },
      prop3: {
        type: 'array',
        items: { type: 'string' },
        selected: false,
        expanded: true,
      },
      prop4: { type: 'string', selected: false, expanded: true },
      prop5: { type: 'number', selected: false, expanded: true },
      prop6: { selected: false, expanded: true },
    },
  },
  outputAllSelectedDepth2: {
    type: 'object',
    properties: {
      prop1: {
        type: 'object',
        properties: {
          objsubprop1: { type: 'string', selected: true, expanded: true },
          objsubprop2: { type: 'number', selected: true, expanded: true },
        },
        selected: true,
        expanded: true,
      },
      prop2: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            arrsubprop1: { type: 'string', selected: true, expanded: true },
            arrsubprop2: { type: 'number', selected: true, expanded: true },
          },
        },
        selected: true,
        expanded: true,
      },
      prop3: {
        type: 'array',
        items: { type: 'string' },
        selected: true,
        expanded: true,
      },
      prop4: { type: 'string', selected: true, expanded: true },
      prop5: { type: 'number', selected: true, expanded: true },
      prop6: { selected: true, expanded: true },
    },
  },
};

module.exports = {
  setFieldSelectorAttributesData,
};
