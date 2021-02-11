import { expect } from 'chai';
import {
  generateSchemaFromJSONDataSimple,
  generateSchemaFromJSONDataComplex,
} from '../../../fixtures/unit/public/app/schema';
import generateSchemaFromJSON from '../../../../public/app/schema/generateSchemaFromJSON';

describe('Schema generation', () => {
  it(`generateSchemaFromJSON correctly generates simple schema`, () => {
    const { input, output: expected } = generateSchemaFromJSONDataSimple;
    const output = generateSchemaFromJSON(input, false, 1);
    expect(output).to.deep.equal(expected);
  });

  it(`generateSchemaFromJSON correctly generates complex schema`, () => {
    const { input, output: expected } = generateSchemaFromJSONDataComplex;
    const output = generateSchemaFromJSON(input, false, 1);
    expect(output).to.deep.equal(expected);
  });
});
