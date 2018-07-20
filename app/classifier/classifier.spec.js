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

const subject = mockPanoptesResource('subject', {
  id: 'a',
  locations: [
    { 'text/plain': 'a fake URL'}
  ]
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
      before(function () {
        wrapper = shallow(<Classifier classification={classification} subject={subject} />, mockReduxStore);
        wrapper.instance().componentDidMount();
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
    before(function () {
      wrapper = shallow(<Classifier />, mockReduxStore);
    });
    it('should preserve annotations from an incomplete classification', function () {
      const newProps = { classification, subject };
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
    before(function () {
      wrapper = shallow(<Classifier />, mockReduxStore);
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
    it('should preserve any existing annotations', function () {
      const newProps = { classification, subject };
      wrapper.setProps(newProps);
      const state = wrapper.state();
      expect(state.annotations).to.deep.equal(classification.annotations);
      expect(state.workflowHistory).to.deep.equal(['T0', 'T1']);
    });
  });

  describe('on completing a classification', function () {
    let checkForFeedback;
    let fakeEvent;
    beforeEach(function () {
      checkForFeedback = sinon.stub(Classifier.prototype, 'checkForFeedback').callsFake(() => Promise.resolve());
      wrapper = shallow(
        <Classifier
          classification={classification}
          subject={subject}
          onComplete={classification.save}
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
    });

    describe('with summaries enabled', function () {
      it('should display a classification summary', function (done) {
        wrapper.setProps({ workflow });
        wrapper.instance().completeClassification(fakeEvent)
        .then(function () {
          wrapper.update();
          const state = wrapper.state();
          expect(classification.completed).to.equal(true);
          expect(state.annotations).to.deep.equal(classification.annotations);
          expect(wrapper.find('ClassificationSummary')).to.have.lengthOf(1);
        })
        .then(done, done);
      });
    });

    describe('with summaries disabled', function () {
      it('should not show a summary', function (done) {
        workflow.configuration.hide_classification_summaries = true;
        wrapper.setProps({ workflow });
        wrapper.instance().completeClassification(fakeEvent)
        .then(function () {
          wrapper.update();
          const state = wrapper.state();
          expect(state.annotations).to.deep.equal(classification.annotations);
          expect(classification.completed).to.equal(true);
          expect(wrapper.find('ClassificationSummary')).to.have.lengthOf(0);
        })
        .then(done, done);
      });
    });
  });

  describe('with feedback enabled', function () {
    let feedbackInitSpy;
    let feedbackUpdateSpy;
    let feedbackCheckSpy;

    before(function () {
      feedbackInitSpy = sinon.spy();
      feedbackUpdateSpy = sinon.spy();
      feedbackCheckSpy = sinon.spy(Classifier.prototype, 'checkForFeedback');
    });

    beforeEach(function () {
      const feedback = {
        active: true
      };
      const actions = {
        feedback: {
          init: feedbackInitSpy,
          update: feedbackUpdateSpy
        },
        interventions: {
          dismiss: sinon.stub()
        }
      };
      wrapper = shallow(
        <Classifier
          classification={classification}
          subject={subject}
          feedback={feedback}
          actions={actions}
        />
      );
      wrapper.instance().componentDidMount();
    });

    afterEach(function () {
      feedbackUpdateSpy.resetHistory();
      feedbackCheckSpy.resetHistory();
    });

    after(function () {
      feedbackCheckSpy.restore();
    })
    
    describe('when the task changes', function () {

      beforeEach(function () {
        const newAnnotation = {task: 'T3', value: 'new task'};
        const annotations = classification.annotations.slice();
        annotations.push(newAnnotation);
        wrapper.instance().updateAnnotations(annotations);
        wrapper.instance().onNextTask(newAnnotation.task);
      });

      it('should check for feedback', function () {
        expect(feedbackCheckSpy.callCount).to.equal(1);
      });

      it('should update feedback', function () {
        expect(feedbackUpdateSpy.callCount).to.equal(1);
      });

      it('should update feedback for the previous annotation', function () {
        const prevAnnotation = classification.annotations[1];
        expect(feedbackUpdateSpy.calledWith(prevAnnotation)).to.equal(true);
      });
    });
    
    describe('when a classification is complete', function () {
      let newAnnotation;

      beforeEach(function () {
        newAnnotation = {task: 'T3', value: 'new task'};
        const annotations = classification.annotations.slice();
        annotations.push(newAnnotation);
        const workflowHistory = wrapper.state().workflowHistory;
        workflowHistory.push(newAnnotation.task);
        wrapper.setState({ annotations, workflowHistory });
      });

      it('should check for feedback', function (done) {
        const fakeEvent = {
          currentTarget: {},
          preventDefault: () => null
        }
        wrapper.instance().completeClassification(fakeEvent)
        .then(function () {
          expect(feedbackCheckSpy.callCount).to.equal(1);
        })
        .then(done, done);
      
      });

      it('should update feedback for the last annotation', function (done) {
        const fakeEvent = {
          currentTarget: {},
          preventDefault: () => null
        }
        wrapper.instance().completeClassification(fakeEvent)
        .then(function () {
          expect(feedbackUpdateSpy.calledWith(newAnnotation)).to.equal(true);
        })
        .then(done, done);
      
      });
    })

    describe('when the first task loads', function () {
      beforeEach(function () {
        const newProps = {
          subject: Object.assign({}, subject, { id: 'b' }),
          classification: mockPanoptesResource('classifications', { annotations: [] })
        }
        wrapper.setProps(newProps);
        const newAnnotation = {task: 'T0', value: 'default value'};
        const annotations = classification.annotations.slice();
        annotations.push(newAnnotation);
        wrapper.instance().updateAnnotations(annotations);
        wrapper.instance().onNextTask(newAnnotation.task);
      });

      it('should not check for feedback', function () {
        expect(feedbackCheckSpy.callCount).to.equal(0);
      });

      it('should not update feedback', function () {
        expect(feedbackUpdateSpy.callCount).to.equal(0);
      })
    });
  });
});
