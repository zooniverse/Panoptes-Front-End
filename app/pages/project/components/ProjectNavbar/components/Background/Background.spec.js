/* eslint
  func-names: 0,
  import/no-extraneous-dependencies: ["error", { "devDependencies": true }]
  prefer-arrow-callback: 0,
  "react/jsx-boolean-value": ["error", "always"]
*/

import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import Background, { BackgroundWrapper, ImgBackground } from './Background';

const MOCK_SRC = '../../../../../assets/default-project-background.jpg';

describe('Background', function () {
  let wrapper;

  it('should render without crashing', function () {
    shallow(<Background src={''} />);
  });

  describe('when props.src is not defined', function() {
    before(function () {
      wrapper = shallow(<Background src={''} />);
    });

    it('should set BackgroundWrapper\'s prop.hasBg to false', function() {
      expect(wrapper.children().props().hasBg).to.be.false;
    });

    it('should not render ImgBackground', function() {
      expect(wrapper.find(ImgBackground)).to.have.lengthOf(0);
    });
  });

  describe('when props.src is defined', function() {
    before(function () {
      wrapper = shallow(<Background src={MOCK_SRC} />);
    });

    it('should set BackgroundWrapper\'s prop.hasBg to true', function () {
      expect(wrapper.children().props().hasBg).to.be.true;
    });

    it('should not render ImgBackground', function () {
      expect(wrapper.find(ImgBackground)).to.have.lengthOf(1);
    });
  });
});
