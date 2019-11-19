import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import EllipseLabComponent from './ellipse-lab-component';

describe('feedback drawing ellipse: lab component', function () {
  function mockFormState(ruleID) {
    return {
      defaultFailureMessage: "Nope, please try again.",
      defaultSuccessMessage: "Correct, nice job!",
      failureEnabled: true,
      hideSubjectViewer: true,
      id: `${ruleID}`,
      successEnabled: true
    };
  }

  describe('with CheckboxInput', function () {
    const handleCheckboxInputChangeSpy = sinon.spy();
    const wrapper = shallow(<EllipseLabComponent formState={mockFormState(5678)} handleInputChange={handleCheckboxInputChangeSpy} />);
    const checkboxInput = wrapper.find('CheckboxInput');

    it('should include a CheckboxInput component', function () {
      expect(checkboxInput).to.have.lengthOf(1);
    });

    it('should reflect the hideSubjectViewer value provided', function () {
      expect(checkboxInput.prop('checked')).to.be.true;
    });

    it('should call handleInputChange on change', function () {
      checkboxInput.simulate('change');
      expect(handleCheckboxInputChangeSpy.calledOnce).to.be.true;
    });
  });
});
