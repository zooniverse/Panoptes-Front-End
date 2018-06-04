import React from 'react';
import PropTypes from 'prop-types';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import { Classifier } from './classifier';

const store = {
  subscribe: () => { },
  dispatch: () => { },
  getState: () => ({
    userInterface: { theme: 'light' }
  })
};

const mockReduxStore = {
  context: { store },
  childContextTypes: { store: PropTypes.object.isRequired }
};

let wrapper;
before(function () {
  wrapper = shallow(<Classifier />, mockReduxStore);
});

describe('Classifier', function () {
  it('should render with only default props', function () {
    const instance = wrapper.instance();
    expect(instance).to.be.instanceOf(Classifier);
  });
  describe('on mount', function () {
    it('should initialise annotations', function () {
      const state = wrapper.state();
      expect(state.annotations).to.have.lengthOf(0);
    });
    it('should initialise workflow history', function () {
      const state = wrapper.state();
      expect(state.workflowHistory).to.have.lengthOf(0);
    });
    it('should preserve annotations from an incomplete classification', function () {
      
    });
  });
  describe('on receiving a new classification', function () {
    it('should reset annotations and workflow history', function () {
      
    });
    it('should preserve annotations from an incomplete classification', function () {
      
    });
  });
  describe('on receiving a new subject', function () {
    it('should reset annotations and workflow history', function () {
      
    });
  });
  describe('on completing a classification', function () {
    describe('with summaries enabled', function () {
      it('should display a classification summary', function () {
        
      });
    });
    describe('with summaries disabled', function () {
      it('should reset annotations and workflow history', function () {
        
      });
    })
  })
});