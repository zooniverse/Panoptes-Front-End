/* eslint
  func-names: 0,
  import/no-extraneous-dependencies: ["error", { "devDependencies": true }]
  prefer-arrow-callback: 0,
  "react/jsx-boolean-value": ["error", "always"]
*/

import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import { TaskInputField, StyledTaskInputField } from './TaskInputField';
import { mockReduxStore, radioTypeAnnotation } from '../../testHelpers';

describe('TaskInputField', function () {
  describe('render', function () {
    let wrapper;
    before(function () {
      wrapper = mount(<TaskInputField annotation={radioTypeAnnotation} index={0} type="radio" />, mockReduxStore);
    });

    it('should render without crashing', function () {
      expect(wrapper).to.be.ok;
    });

    it('should renders a ThemeProvider', function () {
      expect(wrapper.find('ThemeProvider')).to.have.lengthOf(1);
    });

    it('should render a StyledTaskInputField', function () {
      expect(wrapper.find(StyledTaskInputField)).to.have.lengthOf(1);
    });

    it('should render a TaskInputLabel', function () {
      expect(wrapper.find('TaskInputLabel')).to.have.lengthOf(1);
    });

    it('should use props.className in its classlist', function () {
      wrapper.setProps({ className: 'active' });
      expect(wrapper.props().className).to.include('active');
    });
  });


  describe('onChange method', function () {
    let onChangePropsSpy;
    let wrapper;
    before(function () {
      onChangePropsSpy = sinon.spy();
      wrapper = mount(<TaskInputField annotation={radioTypeAnnotation} onChange={onChangePropsSpy} index={0} type="radio" />, mockReduxStore);
    });

    afterEach(function () {
      onChangePropsSpy.resetHistory();
    });

    it('should call onChange when the on change event is fired', function () {
      wrapper.find('input').simulate('change');
      expect(onChangePropsSpy).to.have.been.calledOnce;
    });
  });
});
