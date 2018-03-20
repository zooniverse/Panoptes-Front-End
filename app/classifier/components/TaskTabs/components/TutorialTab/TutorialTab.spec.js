/* eslint
  func-names: 0,
  import/no-extraneous-dependencies: ["error", { "devDependencies": true }]
  prefer-arrow-callback: 0,
  "react/jsx-boolean-value": ["error", "always"]
*/

import React from 'react';
import { shallow, mount } from 'enzyme';
import { expect } from 'chai';
import TutorialTab, { StyledRestartButton } from './TutorialTab';

const tutorial = {
  steps: [
    { content: 'Step 1', media: '' }
  ]
};

describe('TutorialTab', function() {
  it('should render without crashing', function() {
    expect(shallow(<TutorialTab />)).to.be.ok;
  });

  it('should render null if there is no tutorial', function() {
    const wrapper = shallow(<TutorialTab />);
    expect(wrapper.html()).to.be.null;
  });

  describe('when TutorialTab renders', function() {
    let wrapper;
    before(function() {
      wrapper = mount(<TutorialTab tutorial={tutorial} />);
    });

    it('should render a ThemeProvider', function() {
      expect(wrapper.find('ThemeProvider')).to.have.lengthOf(1);
    });

    it('should render a StyledRestartButton', function() {
      expect(wrapper.find(StyledRestartButton)).to.have.length(1);
    });

    it('should render a Translate component', function() {
      expect(wrapper.find('Translate')).to.have.lengthOf(1);
    });
  });
});
