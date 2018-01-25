/* eslint
  func-names: 0,
  import/no-extraneous-dependencies: ["error", { "devDependencies": true }]
  prefer-arrow-callback: 0,
  "react/jsx-boolean-value": ["error", "always"]
*/

import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import injectStyledUtils from 'styled-components-test-utils/lib/expect';

import Background, { BackgroundWrapper, ImgBackground } from './Background';
import { zooTheme } from '../../../../../../theme';

injectStyledUtils(expect);

const MOCK_SRC = '../../../../../assets/default-project-background.jpg';

describe.only('Background', function () {
  let wrapper;

  it('should render without crashing', function () {
    shallow(<Background src={''} />);
  });

  describe('when props.src is not defined', function() {
    before(function () {
      wrapper = shallow(<Background src={''} />);
    });

    it('should set BackgroundWrapper\'s prop.hasBg to false', function() {
      expect(wrapper.dive().props().hasBg).to.be.false;
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
      expect(wrapper.dive().props().hasBg).to.be.true;
    });

    it('should not render ImgBackground', function () {
      expect(wrapper.find(ImgBackground)).to.have.lengthOf(1);
    });
  });

  describe('BackgroundWrapper', function() {
    let backgroundWrapperWrapper;
    before(function() {
      backgroundWrapperWrapper = shallow(<BackgroundWrapper hasBg={false} />);
    });

    it('should have a teal background when props.hasBg is false', function() {
      expect(backgroundWrapperWrapper).toHaveStyleRule('background-color', zooTheme.colors.teal.mid);
    });

    it('should have a black background when props.hasBg is true', function() {
      backgroundWrapperWrapper.setProps({ hasBg: true });
      expect(backgroundWrapperWrapper).toHaveStyleRule('background-color', 'black');
    });
  });
});
