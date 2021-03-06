import React from 'react';
import { useTranslation } from 'react-i18next';
import { components } from 'react-select';
import { formatDisplayedSelection } from '../../../utils/charts';

// this component, used within the UsersSelect component, overrides react-select's default text display
// by default, react-select will keep expanding its text display as additional options are selected
// with this component, after 2 selections, the text box will stop expanding and display: 'A, B, and X other(s) selected'
// eslint-disable-next-line react/prop-types
const CustomValueContainer = ({ children, ...props }) => {
  const { t } = useTranslation();

  // values is an array of objects corresponding to the currently made selection
  let [values] = children;

  if (Array.isArray(values)) {
    const { length } = values;
    const alsoSelectedCount = length - 2;
    if (length === 1) {
      values = `${formatDisplayedSelection(values[0].key)}`;
    } else if (length === 2) {
      values = `${formatDisplayedSelection(
        values[0].key,
      )}, ${formatDisplayedSelection(values[1].key)}`;
    } else {
      const firstSelection = formatDisplayedSelection(values[0].key);
      const secondSelection = formatDisplayedSelection(values[1].key);
      values = t('Many users selected...', {
        firstSelection,
        secondSelection,
        count: alsoSelectedCount,
      });
    }
  }

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <components.ValueContainer {...props}>
      {values}
      {children[1]}
    </components.ValueContainer>
  );
};

export default CustomValueContainer;
