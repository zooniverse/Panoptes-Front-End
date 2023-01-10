import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import TranslationTools from './translation-tools';

describe('TranslationTools', () => {
  const wrapper = shallow(<TranslationTools languageCode="en" />);
  it('should render with default props', () => {
    expect(wrapper).to.be.ok;
  });
});
