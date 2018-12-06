import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import { ProjectClassifyPage } from './classify';
import FinishedBanner from './finished-banner';

const actions = {
  classifier: {
    createClassification: sinon.spy(),
    emptySubjectQueue: sinon.spy(),
    fetchSubjects: sinon.stub().callsFake(() => Promise.resolve()),
    resumeClassification: sinon.spy()
  }
};

const workflow = {
  id: '1'
};

describe('ProjectClassifyPage', function () {
  let wrapper;
  const project = {
    experimental_tools: []
  };

  before(function () {
    wrapper = shallow(
      <ProjectClassifyPage
        actions={actions}
        classification={null}
        project={project}
        upcomingSubjects={[]}
        workflow={workflow}
      />,
      {
        context: {
          geordi: {
            forget: sinon.spy(),
            remember: sinon.spy()
          }
        },
        disableLifecycleMethods: false
      }
    );
  });

  it('renders when not logged in', function () {
    expect(wrapper.find('.classify-page')).to.have.lengthOf(1);
  });

  it('never tells you when the project is finished', () => {
    expect(wrapper.find(FinishedBanner)).to.have.lengthOf(0);
  });

  describe('on first load', function () {
    after(function () {
      actions.classifier.createClassification.resetHistory();
      actions.classifier.fetchSubjects.resetHistory();
      actions.classifier.emptySubjectQueue.resetHistory();
    });

    it('should fetch new subjects', function () {
      expect(actions.classifier.fetchSubjects.callCount).to.equal(1);
    });
    it('should create a new classification', function () {
      expect(actions.classifier.createClassification.callCount).to.equal(1);
    });
  });

  describe('on loading a classification', function () {
    let classification;
    let upcomingSubjects;

    beforeEach(function () {
      classification = {
        annotations: [],
        links: {
          workflow: '1'
        }
      };
    });

    describe('with only one subject in the queue', function () {
      after(function () {
        actions.classifier.createClassification.resetHistory();
        actions.classifier.fetchSubjects.resetHistory();
        actions.classifier.emptySubjectQueue.resetHistory();
      });

      beforeEach(function () {
        upcomingSubjects = [{}];
        wrapper.setProps({ classification, upcomingSubjects });
      });

      it('should fetch new subjects', function () {
        expect(actions.classifier.fetchSubjects.callCount).to.equal(1);
      });

      it('should create a new classification', function () {
        expect(actions.classifier.createClassification.callCount).to.equal(1);
      });
    });

    describe('when the workflow changes', function () {
      beforeEach(function () {
        const newWorkflow = {
          id: '2'
        };
        wrapper.setProps({ workflow: newWorkflow });
      });

      it('should empty the subject queue', function () {
        expect(actions.classifier.emptySubjectQueue.callCount).to.equal(1);
        actions.classifier.emptySubjectQueue.resetHistory();
      });
    });
  });

  describe('with an invalid classification for the workflow', function () {
    beforeEach(function () {
      const newWorkflow = {
        id: '2'
      };
      const classification = {
        annotations: [],
        links: {
          workflow: '1'
        }
      };
      wrapper = shallow(
        <ProjectClassifyPage
          actions={actions}
          classification={classification}
          project={project}
          upcomingSubjects={[]}
          workflow={newWorkflow}
        />,
        {
          context: {
            geordi: {
              forget: sinon.spy(),
              remember: sinon.spy()
            }
          },
          disableLifecycleMethods: false
        }
      );
    });

    it('should empty the subject queue', function () {
      expect(actions.classifier.emptySubjectQueue.callCount).to.equal(1);
      actions.classifier.emptySubjectQueue.resetHistory();
    });
  });

  describe('with a valid classification for the workflow', function () {
    beforeEach(function () {
      const classification = {
        annotations: [],
        links: {
          workflow: '1'
        }
      };
      wrapper = shallow(
        <ProjectClassifyPage
          actions={actions}
          classification={classification}
          project={project}
          upcomingSubjects={[]}
          workflow={workflow}
        />,
        {
          context: {
            geordi: {
              forget: sinon.spy(),
              remember: sinon.spy()
            }
          },
          disableLifecycleMethods: false
        }
      );
    });

    it('should resume the classification', function () {
      expect(actions.classifier.resumeClassification.callCount).to.equal(1);
    });
  });
});
