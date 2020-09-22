import React from 'react';
import { shallow } from 'enzyme';
import { App } from './App';

describe('<App />', () => {
  const props = {
    i18n: {
      defaultNS: '',
      changeLanguage: jest.fn(),
    },
    t: jest.fn(),
    dispatchGetLanguage: jest.fn(),
    lang: 'en',
  };

  // eslint-disable-next-line react/jsx-props-no-spreading
  const component = shallow(<App {...props} />);
  it('renders correctly', () => {
    expect(component).toMatchSnapshot();
  });
});
