import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { TranslationsManager } from './';

describe('TranslationsManager', function () {
  const wrapper = shallow(<TranslationsManager />);
  it('should render with default props', function () {
    expect(wrapper).to.be.ok;
  });
});
