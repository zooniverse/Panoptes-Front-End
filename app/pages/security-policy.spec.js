import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import SecurityPolicy from './privacy-policy';

describe('SecurityPolicy', () => {
  it('should render without crashing', () => {
    const wrapper = shallow(<SecurityPolicy />);
    assert.equal(wrapper.find('div.content-container').length, 1);
  });
});
