/* eslint prefer-arrow-callback: 0, func-names: 0, 'react/jsx-boolean-value': ['error', 'always'], 'react/jsx-filename-extension': 0 */
import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';

import TextFromSubjectTask from '.';

describe('TextFromSubjectTask', function () {
  it('should render without crashing', function () {
    const wrapper = shallow(<TextFromSubjectTask />);
    expect(wrapper).to.be.ok;
  });

  describe('static methods', function () {
    it('should be incomplete', function () {
      expect(TextFromSubjectTask.isAnnotationComplete()).to.be.false;
    });

    it('should have the correct instruction text', function () {
      expect(TextFromSubjectTask.getTaskText({ instruction: 'Correct the OCR text' })).to.equal('Correct the OCR text');
    });
  });
});
