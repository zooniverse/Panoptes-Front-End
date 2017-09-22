import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import PrivacyPolicy from './privacy-policy';

describe('PrivacyPolicy', () => {
  it('should render without crashing', () => {
    const wrapper = shallow(<PrivacyPolicy />);
    assert.equal(wrapper.find('div.content-container').length, 1);
  });
});
