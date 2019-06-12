import React from 'react';
import PropTypes from 'prop-types';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import { Classifier } from './classifier';
import mockPanoptesResource from '../../test/mock-panoptes-resource';

global.innerWidth = 1000;
global.innerHeight = 1000;

const store = {
  subscribe: () => { },
  dispatch: () => { },
  getState: () => ({
    userInterface: { theme: 'light' }
  })
};

const geordi = {
  keys: {},
  forget: sinon.stub(),
  remember: sinon.stub()
};

const mockReduxStore = {
  context: { geordi, store },
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
  ],
  metadata: {
    subject_dimensions: []
  },
  links: {
    workflow: 'test',
    subjects: ['a']
  }
});

const workflow = mockPanoptesResource('workflow', {
  id: '3',
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

    describe('with annotations', function () {
      it('should resume work in progress', function () {
        const newProps = { classification, subject };
        wrapper.setProps(newProps);
        const state = wrapper.state();
        expect(state.annotations).to.deep.equal(classification.annotations);
        expect(state.workflowHistory).to.deep.equal(['T0', 'T1']);
      });
    });

    describe('without annotations', function () {
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

  describe('on subject image load', function () {
    const actions = {
      classify: {
        updateMetadata: sinon.stub().callsFake(changes => changes)
      }
    };
    const fakeEvent = {
      target: {
        clientWidth: 500,
        clientHeight: 250,
        naturalWidth: 1000,
        naturalHeight: 500
      },
      preventDefault: () => null
    };
    beforeEach(function () {
      wrapper = shallow(
        <Classifier
          actions={actions}
          classification={classification}
          subject={subject}
          onComplete={classification.save}
        />,
        mockReduxStore
      );
      wrapper.instance().handleSubjectImageLoad(fakeEvent, 0);
    });
    afterEach(function () {
      actions.classify.updateMetadata.resetHistory();
    });
    it('should update the classification with the image dimensions', function () {
      const expectedChanges = {
        subject_dimensions: [fakeEvent.target]
      };
      const actualChanges = actions.classify.updateMetadata.returnValues[0];
      expect(actualChanges).to.deep.equal(expectedChanges);
    });
  });

  describe('on completing a classification', function () {
    let checkForFeedback;
    let fakeEvent;
    const actions = {
      classify: {
        completeClassification: sinon.stub(),
        saveAnnotations: sinon.stub().callsFake(annotations => annotations),
        updateMetadata: sinon.stub()
      },
      interventions: {
        dismiss: sinon.stub()
      }
    };
    const translations = {
      locale: 'it',
      strings: {
        workflow: {
          '3' : {
            id: '123',
            translated_type: 'Workflow',
            translated_id: '3',
            strings: {}
          }
        }
      }
    };
    const existingUUID = '123456';
    beforeEach(function () {
      classification.metadata.interventions = {uuid: existingUUID};
      checkForFeedback = sinon.stub(Classifier.prototype, 'checkForFeedback').callsFake(() => Promise.resolve());
      wrapper = shallow(
        <Classifier
          actions={actions}
          classification={classification}
          subject={subject}
          onComplete={classification.save}
          translations={translations}
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
      actions.classify.completeClassification.resetHistory();
      actions.classify.updateMetadata.resetHistory();
    });

    it('should complete the classification', function (done) {
      wrapper.setProps({ workflow });
      wrapper.instance().completeClassification(fakeEvent).then(function () {
        const { annotations } = wrapper.state();
        expect(actions.classify.completeClassification).to.have.been.calledWith(annotations);
      })
      .then(done, done);
    });
    it('should record intervention metadata', function (done) {
      wrapper.setProps({ workflow });
      wrapper.instance().completeClassification(fakeEvent)
      .then(done, done);
      const changes = actions.classify.updateMetadata.getCall(0).args[0];
      expect(changes.interventions.messageShown).to.be.false;
      expect(changes.interventions.opt_in).to.be.false;
      expect(changes.interventions.uuid).to.equal(existingUUID);
    });
    it('should record translation metadata', function (done) {
      wrapper.setProps({ workflow });
      wrapper.instance().completeClassification(fakeEvent)
      .then(done, done);
      const changes = actions.classify.updateMetadata.getCall(0).args[0];
      const { translations } = wrapper.instance().props;
      expect(changes.workflow_translation_id).to.equal(translations.strings.workflow[workflow.id].id);
      expect(changes.user_language).to.equal('it');
    })
    describe('with an intervention message', function () {
      const intervention = {
        message: 'Hello!'
      };
      const user = {
        intervention_notifications: true
      };
      it('should record that an intervention was received', function (done) {
        wrapper.setProps({ workflow, intervention, user });
        wrapper.instance().completeClassification(fakeEvent)
        .then(done, done);
        const changes = actions.classify.updateMetadata.getCall(0).args[0];
        expect(changes.interventions.messageShown).to.be.true;
      });
      it('should record whether the user is reading interventions', function () {
        wrapper.setProps({ workflow, intervention, user });
        wrapper.instance().completeClassification(fakeEvent);
        const changes = actions.classify.updateMetadata.getCall(0).args[0];
        expect(changes.interventions.opt_in).to.equal(user.intervention_notifications);
      });
    });
    describe('with summaries enabled', function () {
      it('should display a classification summary', function (done) {
        wrapper.setProps({ workflow });
        wrapper.instance().completeClassification(fakeEvent)
        .then(function () {
          wrapper.update();
          const state = wrapper.state();
          expect(wrapper.find('ClassificationSummary')).to.have.lengthOf(1);
        })
        .then(done, done);
      });
      it('should not update annotations on going to Talk', function (done) {
        wrapper.setProps({ workflow });
        wrapper.instance().completeClassification(fakeEvent)
        .then(function () {
          wrapper.update();
          wrapper.unmount();
          expect(actions.classify.saveAnnotations.callCount).to.equal(0);
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
        classify: {
          completeClassification: sinon.stub(),
          saveAnnotations: sinon.stub().callsFake(annotations => annotations),
          updateMetadata: sinon.stub()
        },
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
        expect(feedbackUpdateSpy).to.have.been.calledWith(prevAnnotation);
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
          expect(feedbackUpdateSpy).to.have.been.calledWith(newAnnotation);
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

  describe('on updating annotations', function () {
    const actions = {
      classify: {
        saveAnnotations: sinon.stub().callsFake(annotations => annotations)
      }
    };
    const mockAnnotations = [{
      task: 'a',
      value: 1
    }, {
      task: 'b',
      value: 2
    }, {
      task: 'c',
      value: 3
    }];

    before(function () {
      wrapper.setProps({ actions });
      wrapper.instance().updateAnnotations(mockAnnotations);
    });

    it('should save any annotations in progress', function () {
      const annotations = actions.classify.saveAnnotations.returnValues[0];
      expect(annotations).to.deep.equal(mockAnnotations);
    });
  });
});
