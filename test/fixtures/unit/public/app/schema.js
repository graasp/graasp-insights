const generateSchemaFromJSONDataSimple = {
  input: {
    prop1: 1,
    prop2: 'value',
    prop3: true,
    prop4: [1, 2, 3],
    prop5: {
      subprop1: 10,
      subprop2: 'subvalue',
    },
    prop6: null,
  },
  output: {
    type: 'object',
    required: [],
    properties: {
      prop1: { type: 'number' },
      prop2: { type: 'string' },
      prop3: { type: 'bool' },
      prop4: { type: 'array', items: { type: 'number' } },
      prop5: {
        type: 'object',
        required: [],
        properties: {
          subprop1: { type: 'number' },
          subprop2: { type: 'string' },
        },
      },
      prop6: { type: 'null' },
    },
  },
};

const generateSchemaFromJSONDataComplex = {
  input: {
    prop1: {
      subprop1: {
        subsubprop1: 1,
        subsubprop2: 2,
        subsubprop3: '3',
      },
    },
    prop2: [
      {
        arrprop1: 1,
        arrprop2: 2,
        arrprop3: [1, 2, 3],
      },
      {
        arrprop1: 1,
        arrprop2: '2',
        arrprop3: ['1', '2', '3'],
      },
      {
        arrprop1: 1,
        arrprop2: { arrsubprop1: 2 },
        arrprop3: [null, null, null],
      },
      {
        arrprop1: 1,
        arrprop2: [true, false, true],
        arrprop3: [true, true, false],
      },
    ],
  },
  output: {
    type: 'object',
    required: [],
    properties: {
      prop1: {
        type: 'object',
        required: [],
        properties: {
          subprop1: {
            type: 'object',
            required: [],
            properties: {
              subsubprop1: { type: 'number' },
              subsubprop2: { type: 'number' },
              subsubprop3: { type: 'string' },
            },
          },
        },
      },
      prop2: {
        type: 'array',
        items: {
          type: 'object',
          required: [],
          properties: {
            arrprop1: {
              type: 'number',
            },
            arrprop2: {
              type: ['number', 'string', 'object', 'array'],
              required: [],
              properties: {
                arrsubprop1: { type: 'number' },
              },
              items: { type: 'bool' },
            },
            arrprop3: {
              type: 'array',
              items: {
                type: ['number', 'string', 'null', 'bool'],
              },
            },
          },
        },
      },
    },
  },
};

module.exports = {
  generateSchemaFromJSONDataSimple,
  generateSchemaFromJSONDataComplex,
};
