import { expect } from 'chai';
import {
  generateFieldSelectorData,
  fieldSelectorUnselectAllData,
} from '../../fixtures/unit/shared/utils';
import {
  generateFieldSelector,
  fieldSelectorUnselectAll,
} from '../../../src/shared/utils';

describe('Field selector helpers', () => {
  it(`generateFieldSelector correctly adds values for depth=1`, () => {
    const { input, outputDepth1: expected } = generateFieldSelectorData;
    const output = generateFieldSelector(input, 1);
    expect(output).to.deep.equal(expected);
  });

  it(`generateFieldSelector correctly adds values for depth=2`, () => {
    const { input, outputDepth2: expected } = generateFieldSelectorData;
    const output = generateFieldSelector(input, 2);
    expect(output).to.deep.equal(expected);
  });

  it(`fieldSelectorUnselectAll correctly unselects all`, () => {
    const { input, output: expected } = fieldSelectorUnselectAllData;
    const output = fieldSelectorUnselectAll(input);
    expect(output).to.deep.equal(expected);
  });
});
