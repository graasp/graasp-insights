import { expect } from 'chai';
import { setFieldSelectorAttributesData } from '../../fixtures/unit/shared/utils';
import {
  setFieldSelectorAttributes,
  fieldSelectorUnselectAll,
} from '../../../src/shared/utils';

describe('Field selector helpers', () => {
  it(`setFieldSelectorAttributes correctly adds values for depth=1`, () => {
    const {
      input,
      outputAllUnselectedDepth1: expected,
    } = setFieldSelectorAttributesData;
    const output = setFieldSelectorAttributes(input, false, 1);
    expect(output).to.deep.equal(expected);
  });

  it(`setFieldSelectorAttributes correctly adds values for depth=2`, () => {
    const {
      input,
      outputAllUnselectedDepth2: expected,
    } = setFieldSelectorAttributesData;
    const output = setFieldSelectorAttributes(input, false, 2);
    expect(output).to.deep.equal(expected);
  });

  it(`Correctly select and unselect all`, () => {
    const {
      input,
      outputAllSelectedDepth2: expectedAllSelected,
      outputAllUnselectedDepth2: expectedAllUnselected,
    } = setFieldSelectorAttributesData;
    const outputAllSelected = setFieldSelectorAttributes(input, true, 2);
    expect(outputAllSelected).to.deep.equal(expectedAllSelected);

    const outputAllUnselected = fieldSelectorUnselectAll(outputAllSelected);
    expect(outputAllUnselected).to.deep.equal(expectedAllUnselected);
  });
});
