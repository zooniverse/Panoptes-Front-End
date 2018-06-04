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

const classification = {
  annotations: [
    {
      task: 'T0',
      value: 'something'
    },
    {
      task: 'T1',
      value: 1
    }
  ]
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
    describe('with an incomplete classification', function () {
      let loadSubject;
      before(function () {
        loadSubject = sinon.stub(Classifier.prototype, 'loadSubject').callsFake(() => null);
        wrapper = shallow(<Classifier classification={classification} />, mockReduxStore);
        wrapper.instance().componentDidMount();
      });
      after(function () {
        loadSubject.restore();
      });
      it('should preserve annotations from an incomplete classification', function () {
        const state = wrapper.state();
        expect(state.annotations).to.deep.equal(classification.annotations);
      });
      it('should rebuild workflow history from an incomplete classification', function () {
        const state = wrapper.update().state();
        expect(state.workflowHistory).to.deep.equal(['T0', 'T1']);
      });
    })
  });
  describe('on receiving a new classification', function () {
    let loadSubject;
    before(function () {
      loadSubject = sinon.stub(Classifier.prototype, 'loadSubject').callsFake(() => null);
      wrapper = shallow(<Classifier />, mockReduxStore);
    });
    after(function () {
      loadSubject.restore();
    });
    it('should preserve annotations from an incomplete classification', function () {
      const newProps = { classification };
      wrapper.setProps(newProps);
      const state = wrapper.state();
      expect(state.annotations).to.deep.equal(classification.annotations);
      expect(state.workflowHistory).to.deep.equal(['T0', 'T1']);
    });
    it('should reset annotations and workflow history', function () {
      const newProps = {
        classification: {
          annotations: []
        }
      }
      wrapper.setProps(newProps);
      const state = wrapper.state();
      expect(state.annotations).to.have.lengthOf(0);
      expect(state.workflowHistory).to.have.lengthOf(0);
    });
  });
  describe('on receiving a new subject', function () {
    let loadSubject;
    before(function () {
      loadSubject = sinon.stub(Classifier.prototype, 'loadSubject').callsFake(() => null);
      wrapper = shallow(<Classifier />, mockReduxStore);
    });
    after(function () {
      loadSubject.restore();
    });
    it('should reset annotations and workflow history', function () {
      const newProps = {
        subject: {
          locations: []
        }
      };
      wrapper.setProps(newProps);
      const state = wrapper.state();
      expect(state.annotations).to.have.lengthOf(0);
      expect(state.workflowHistory).to.have.lengthOf(0);
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