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
import TaskInput, { StyledTaskInput } from './TaskInput';
import { mockReduxStore, radioTypeAnnotation, checkboxTypeAnnotation } from '../../../../testHelpers';

describe('TaskInput', function() {
  describe('rendering', function() {
    let wrapper;
    before(function () {
      wrapper = mount(<TaskInput annotation={radioTypeAnnotation} index={0} type="radio" />, mockReduxStore);
    });

    it('should render without crashing', function () {
      expect(wrapper).to.be.ok;
    });

    it('should render a StyledTaskInput', function () {
      expect(wrapper.find(StyledTaskInput)).to.have.lengthOf(1);
    });
  });

  describe('radio input type', function() {
    let wrapper;
    before(function () {
      wrapper = mount(<TaskInput annotation={radioTypeAnnotation} index={0} type="radio" />, mockReduxStore);
    });

    it('should render a radio input type if props.type = "radio"', function () {
      expect(wrapper.find('input').props().type).to.equal('radio');
    });

    it('should not render the input as checked if the annotation.value is null', function() {
      expect(wrapper.find('input').props().checked).to.be.false;
    });

    it('should render the input as checked if the annotation.value is equal to props.index', function() {
      const annotationWithEqualValue = Object.assign({}, radioTypeAnnotation, { value: 0 });
      wrapper.setProps({ annotation: annotationWithEqualValue });
      expect(wrapper.find('input').props().checked).to.be.true;
    });

    it('should not render the input as checked if the annotation.value is not equal to props.index', function() {
      const annotationWithoutEqualValue = Object.assign({}, radioTypeAnnotation, { value: 1 });
      wrapper.setProps({ annotation: annotationWithoutEqualValue });
      expect(wrapper.find('input').props().checked).to.be.false;
    });
  });

  describe('checkbox input type', function() {
    let wrapper;
    before(function () {
      wrapper = mount(<TaskInput annotation={checkboxTypeAnnotation} index={0} type="checkbox" />, mockReduxStore);
    });

    it('should render a checkbox input type when props.type = "checkbox', function () {
      expect(wrapper.find('input').props().type).to.equal('checkbox');
    });

    it('should render the input as not checked if the annotation.value is null', function () {
      expect(wrapper.find('input').props().checked).to.be.false;
    });

    it('should render the input as checked if the annotation.value is an array including a number equal to props.index', function () {
      const annotationWithEqualValue = Object.assign({}, checkboxTypeAnnotation, { value: [0] });
      wrapper.setProps({ annotation: annotationWithEqualValue });
      expect(wrapper.find('input').props().checked).to.be.true;
    });

    it('should not render the input as checked if the annotation.value does not include a number equal to props.index', function() {
      const annotationWithoutEqualValue = Object.assign({}, radioTypeAnnotation, { value: [1] });
      wrapper.setProps({ annotation: annotationWithoutEqualValue });
      expect(wrapper.find('input').props().checked).to.be.false;
    });
  });

  describe('onChange event', function() {
    let wrapper;
    const onChangeSpy = sinon.spy();
    before(function() {
      wrapper = mount(
        <TaskInput annotation={radioTypeAnnotation} index={0} type="radio" onChange={onChangeSpy} />,
        mockReduxStore
      );
    });

    it('should call props.onChange on the onChange event', function () {
      wrapper.find('input').simulate('change');
      expect(onChangeSpy.calledOnce).to.be.true;
    });
  });

  describe('onFocus event', function() {
    let wrapper;
    const onFocusSpy = sinon.spy();
    before(function () {
      wrapper = mount(
        <TaskInput annotation={radioTypeAnnotation} index={0} type="radio" onFocus={onFocusSpy} />,
        mockReduxStore
      );
    });

    it('should call props.onFocus on the onFocus event', function() {
      wrapper.find('input').simulate('focus');      
      expect(onFocusSpy.calledOnce).to.be.true;
    });
  });

  describe('onBlur event', function () {
    let wrapper;
    const onBlurSpy = sinon.spy();
    before(function () {
      wrapper = mount(
        <TaskInput annotation={radioTypeAnnotation} index={0} type="radio" onBlur={onBlurSpy} />,
        mockReduxStore
      );
    });

    it('should call props.onBlur on the onBlur event', function () {
      wrapper.find('input').simulate('blur');      
      expect(onBlurSpy.calledOnce).to.be.true;
    });
  });
});
