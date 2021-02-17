import { expect } from 'chai';
import generateSchemaFromJSON from '../../../../public/app/schema/generateSchemaFromJSON';
import {
  generateSchemaFromJSONDataComplex,
  generateSchemaFromJSONDataSimple,
} from '../../../fixtures/unit/public/app/schema';

describe('Schema generation', () => {
  it(`generateSchemaFromJSON correctly generates simple schema`, () => {
    const { input, output: expected } = generateSchemaFromJSONDataSimple;
    const output = generateSchemaFromJSON(input);
    expect(output).to.deep.equal(expected);
  });

  it(`generateSchemaFromJSON correctly generates complex schema`, () => {
    const { input, output: expected } = generateSchemaFromJSONDataComplex;
    const output = generateSchemaFromJSON(input);
    expect(output).to.deep.equal(expected);
  });
});
