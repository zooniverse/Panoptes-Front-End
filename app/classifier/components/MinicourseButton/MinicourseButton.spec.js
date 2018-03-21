/* eslint
  func-names: 0,
  import/no-extraneous-dependencies: ["error", { "devDependencies": true }]
  prefer-arrow-callback: 0,
  "react/jsx-boolean-value": ["error", "always"]
*/

import React from 'react';
import { shallow, mount } from 'enzyme';
import { expect } from 'chai';
import MinicourseButton, { StyledRestartButton } from './MinicourseButton';

const user = { id: 1 };
const minicourse = {
  steps: [
    { content: 'Step 1', media: '' }
  ]
};

describe.only('MinicourseButton', function() {
  let wrapper;
  before(function() {
    wrapper = shallow(<MinicourseButton />)
  });

  it('should render without crashing', function() {
    expect(wrapper).to.be.ok;
  });

  it('should render null if there is no minicourse', function() {
    wrapper.setProps({ minicourse });
    expect(wrapper.html()).to.be.null;
  });

  it('should render null if there is no user', function() {
    wrapper.setProps({ minicourse: null, user });
    expect(wrapper.html()).to.be.null;
  });

  describe('when MinicourseButton renders', function() {
    let wrapper;
    before(function() {
      wrapper = mount(<MinicourseButton minicourse={minicourse} user={user} />);
    });

    it('should render a VisibilitySplit component', function() {
      expect(wrapper.find('VisibilitySplit')).to.have.lengthOf(1);
    });

    it('should render a ThemeProvider component', function() {
      expect(wrapper.find('ThemeProvider')).to.have.lengthOf(1);
    });

    it('should render a StyledRestartButton component', function() {
      expect(wrapper.find(StyledRestartButton)).to.have.lengthOf(1);
    });

    it('should render a Translate component', function() {
      expect(wrapper.find('Translate')).to.have.lengthOf(1);
    });
  });
});
