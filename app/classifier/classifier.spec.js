import React from 'react';
import PropTypes from 'prop-types';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import apiClient from 'panoptes-client/lib/api-client';
import { Classifier } from './classifier';
import FakeLocalStorage from '../../test/fake-local-storage';

global.innerWidth = 1000;
global.innerHeight = 1000;
global.sessionStorage = new FakeLocalStorage();
sessionStorage.setItem('session_id', JSON.stringify({ id: 0, ttl: 0 }));

function mockPanoptesResource(type, options) {
  const resource = apiClient.type(type).create(options);
  apiClient._typesCache = {};
  sinon.stub(resource, 'save').callsFake(() => Promise.resolve(resource));
  sinon.stub(resource, 'get');
  sinon.stub(resource, 'delete');
  return resource;
}

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

const classification = mockPanoptesResource('classification', {
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
});

const workflow = mockPanoptesResource('workflow', {
  configuration: {
    hide_classification_summaries: false
  },
  tasks: {
    T0: {},
    T1: {}
  }
});

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
    let checkForFeedback;
    let fakeEvent;
    let loadSubject;
    beforeEach(function () {
      loadSubject = sinon.stub(Classifier.prototype, 'loadSubject').callsFake(() => null);
      checkForFeedback = sinon.stub(Classifier.prototype, 'checkForFeedback').callsFake(() => Promise.resolve());
      wrapper = shallow(
        <Classifier
          classification={classification}
          onComplete={classification.save}
          onCompleteAndLoadAnotherSubject={classification.save}
        />,
        mockReduxStore
      );
      wrapper.instance().componentDidMount();
      fakeEvent = {
        currentTarget: {},
        preventDefault: () => null
      }
    });
    afterEach(function () {
      checkForFeedback.restore();
      loadSubject.restore();
    });

    describe('with summaries enabled', function () {
      it('should display a classification summary', function (done) {
        wrapper.setProps({ workflow });
        wrapper.instance().completeClassification(fakeEvent)
        .then(function () {
          wrapper.update();
          expect(classification.completed).to.equal(true);
          expect(wrapper.find('ClassificationSummary')).to.have.lengthOf(1);
          done();
        });
      });
    });

    describe('with summaries disabled', function () {
      it('should reset annotations and workflow history', function (done) {
        workflow.configuration.hide_classification_summaries = true;
        wrapper.setProps({ workflow });
        wrapper.instance().completeClassification(fakeEvent)
        .then(function () {
          wrapper.update();
          const state = wrapper.state();
          expect(state.annotations).to.have.lengthOf(0);
          expect(state.workflowHistory).to.have.lengthOf(0);
          expect(classification.completed).to.equal(true);
          done();
        });
      });
    });
  });
});
