import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import TranslationTools from './translation-tools';

describe('TranslationTools', function () {
  const wrapper = shallow(<TranslationTools languageCode="en" />);
  it('should render with default props', function () {
    expect(wrapper).to.be.ok;
  });
});
