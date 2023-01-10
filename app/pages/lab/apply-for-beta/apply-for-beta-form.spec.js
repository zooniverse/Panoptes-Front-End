import React from 'react';
import assert from 'assert';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';
import ApplyForBetaForm from './apply-for-beta-form';

const MINIMUM_SUBJECT_COUNT = 100;
const REQUIRED_PAGES = ['Research', 'FAQ'];

const createProjectProp = properties => Object.assign({}, {
  id: '1234',
  links: {
    active_workflows: [1, 2]
  },
  private: false,
  live: true
}, properties);

const assertLabelAndCheckboxExist = function (label, checkbox) {
  assert.ok(label.length, 'Label exists');
  assert.ok(checkbox.length, 'Checkbox exists');
};

const assertCheckboxDisabled = function (checkbox, disabled = true) {
  const message = `Checkbox is ${disabled ? 'disabled' : 'enabled'}`;
  assert.ok(checkbox.prop('disabled') === disabled, message);
};

const assertCheckboxChecked = function (checkbox, checked = true) {
  const message = `Checkbox is ${checked ? 'checked' : 'unchecked'}`;
  assert.ok(checkbox.prop('checked') === checked, message);
};

describe('ApplyForBeta component:', () => {
  let project = {};
  let workflows = [];
  let applyFn = Function.prototype;
  let wrapper = Function.prototype;
  let label = Function.prototype;
  let checkbox = Function.prototype;
  let mockPages = [];
  let mockSubjectSets = [];

  const testSetup = function () {
    project = createProjectProp();
    workflows = [1, 2, 3].map(i => ({
      id: i.toString(),
      active: false,
      links: {
        subject_sets: [(i + 3).toString()]
      }
    }));
    applyFn = sinon.spy();
    mockPages = [];
    mockSubjectSets = [
      { id: '0', set_member_subjects_count: 98 }
    ];
  };

  ApplyForBetaForm.__Rewire__('apiClient', {
    type: type => ({
      get() {
        let result = null;
        const resolver = value => new Promise(resolve => resolve(value));
        if (type === 'projects') {
          result = {
            get: () => resolver(mockPages)
          };
        } else if (type === 'subject_sets') {
          result = resolver(mockSubjectSets);
        }
        return result;
      }
    })
  });

  it('should render without crashing', () => {
    testSetup();
    shallow(<ApplyForBetaForm project={project} />);
  });

  describe('checkbox validation:', () => {
    const setWrappers = function (labelText) {
      wrapper = shallow(<ApplyForBetaForm project={project} workflows={workflows} />);
      label = wrapper.findWhere(node => node.type() === 'label' && node.text() === labelText).first();
      checkbox = label.find('input[type="checkbox"]').first();
    };

    describe('disabled checkboxes:', () => {
      describe('public status checkbox:', () => {
        const setPublicStatusWrappers = function () {
          setWrappers('Project is public');
        };

        beforeEach(testSetup);

        it('should exist', () => {
          setPublicStatusWrappers();
          assertLabelAndCheckboxExist(label, checkbox);
        });

        it('should be disabled', () => {
          setPublicStatusWrappers();
          assertCheckboxDisabled(checkbox);
        });

        it('should be unchecked if the project is private', () => {
          project.private = true;
          setPublicStatusWrappers();
          assertCheckboxChecked(checkbox, false);
        });

        it('should be checked if the project is public', () => {
          setPublicStatusWrappers();
          assertCheckboxChecked(checkbox);
        });
      });

      describe('live status checkbox:', () => {
        const setLiveStatusWrappers = function () {
          setWrappers('Project is live');
        };

        beforeEach(testSetup);

        it('should exist', () => {
          setLiveStatusWrappers();
          assertLabelAndCheckboxExist(label, checkbox);
        });

        it('should be disabled', () => {
          setLiveStatusWrappers();
          assertCheckboxDisabled(checkbox);
        });

        it('should be unchecked if the project is in development', () => {
          project.live = false;
          setLiveStatusWrappers();
          assertCheckboxChecked(checkbox, false);
        });

        it('should be checked if the project is live', () => {
          setLiveStatusWrappers();
          assertCheckboxChecked(checkbox);
        });
      });

      describe('active workflow checkbox:', () => {
        const setActiveWorkflowStatusWrappers = function () {
          setWrappers('Project has at least one active workflow');
        };

        beforeEach(testSetup);

        it('should exist', () => {
          setActiveWorkflowStatusWrappers();
          assertLabelAndCheckboxExist(label, checkbox);
        });

        it('should be disabled', () => {
          setActiveWorkflowStatusWrappers();
          assertCheckboxDisabled(checkbox);
        });

        it('should be unchecked if the project has no active workflows', () => {
          project.links.active_workflows = undefined;
          setActiveWorkflowStatusWrappers();
          assertCheckboxChecked(checkbox, false);
        });

        it('should be checked if the project has at least one active workflow', () => {
          setActiveWorkflowStatusWrappers();
          assertCheckboxChecked(checkbox);
        });
      });
    });

    describe('enabled checkboxes:', () => {
      describe('lab policies checkbox:', () => {
        const setLabPoliciesWrappers = function () {
          setWrappers('I have reviewed the policies');
        };

        beforeEach(testSetup);

        it('should exist', () => {
          setLabPoliciesWrappers();
          assertLabelAndCheckboxExist(label, checkbox);
        });

        it('should be enabled', () => {
          setLabPoliciesWrappers();
          assertCheckboxDisabled(checkbox, false);
        });
      });

      describe('best practices checkbox:', () => {
        const setBestPracticesWrappers = function () {
          setWrappers('I have reviewed the best practices');
        };

        beforeEach(testSetup);

        it('should exist', () => {
          setBestPracticesWrappers();
          assertLabelAndCheckboxExist(label, checkbox);
        });

        it('should be enabled', () => {
          setBestPracticesWrappers();
          assertCheckboxDisabled(checkbox, false);
        });
      });

      describe('feedback form checkbox:', () => {
        const setFeedbackFormWrappers = function () {
          setWrappers('I have reviewed the sample beta test project feedback form');
        };

        beforeEach(testSetup);

        it('should exist', () => {
          setFeedbackFormWrappers();
          assertLabelAndCheckboxExist(label, checkbox);
        });

        it('should be enabled', () => {
          setFeedbackFormWrappers();
          assertCheckboxDisabled(checkbox, false);
        });
      });
    });
  });

  // describe('async validation:', function() {
  //   const testForErrorMessage = (regex, result, condition, done) => {
  //     workflows[0].active = true;
  //     wrapper = mount(<ApplyForBetaForm project={project} workflows={workflows} />);
  //     wrapper.find('input[type="checkbox"]').forEach(checkbox => {
  //       checkbox.simulate('change', { target: { checked: true }});
  //     });
  //     wrapper.find('button.standard-button').first().simulate('click');
  //     setTimeout(function() {
  //       const errorMessages = wrapper.find('ul.form-help').at(1).text();
  //       const containsError = regex.test(errorMessages);
  //       assert.ok(containsError === result, condition);
  //       done();
  //     }, 50);
  //   };

  //   describe('content page checks:', function () {
  //     REQUIRED_PAGES.map(function (pageTitle) {
  //       beforeEach(testSetup);

  //       const pattern = 'The following pages are missing content:(.+?)' + pageTitle;
  //       const regex = new RegExp(pattern);

  //       it(`should show an error if ${pageTitle} doesn't exist`, function(done) {
  //         testForErrorMessage(regex, true, `${pageTitle} page doesn't exist`, done);
  //       });

  //       it(`should show an error if ${pageTitle} doesn't have any content`, function(done) {
  //         mockPages.push({
  //           title: pageTitle,
  //           content: '',
  //         });
  //         testForErrorMessage(regex, true, `${pageTitle} page doesn't contain any content`, done);
  //       });

  //       it(`shouldn't show an error if ${pageTitle} exists and has content`, function(done) {
  //         mockPages.push({
  //           title: pageTitle,
  //           content: 'foobar',
  //         });
  //         testForErrorMessage(regex, false, `${pageTitle} page doesn't contain any content`, done);
  //       });
  //     });
  //   });

  //   describe('subject set checks:', function () {
  //     beforeEach(testSetup);

  //     const pattern = 'The project only has (\\d+?) of ' + MINIMUM_SUBJECT_COUNT + ' required subjects';
  //     const regex = new RegExp(pattern);

  //     it(`should show an error if there are less than ${MINIMUM_SUBJECT_COUNT} subjects`, function(done) {
  //       testForErrorMessage(regex, true, `Project contains less than ${MINIMUM_SUBJECT_COUNT} subjects`, done);
  //     });

  //     it(`shouldn't show an error if there are ${MINIMUM_SUBJECT_COUNT} subjects`, function(done) {
  //       mockSubjectSets.push({
  //         id: "1",
  //         set_member_subjects_count: 98,
  //       });
  //       testForErrorMessage(regex, false, `Project contains ${MINIMUM_SUBJECT_COUNT} subjects`, done);
  //     });

  //     it(`shouldn't show an error if there are more than ${MINIMUM_SUBJECT_COUNT} subjects`, function(done) {
  //       mockSubjectSets.push({
  //         id: "1",
  //         set_member_subjects_count: 98,
  //       }, {
  //         id: "2",
  //         set_member_subjects_count: 1,
  //       });
  //       testForErrorMessage(regex, false, `Project contains ${MINIMUM_SUBJECT_COUNT} subjects`, done);
  //     });
  //   });
  // });

  describe('apply button behaviour:', () => {
    beforeEach(testSetup);

    it('should exist', () => {
      wrapper = shallow(<ApplyForBetaForm project={project} workflows={workflows} />);
      const button = wrapper.find('button.standard-button').first();
      assert(button.length > 0, 'Button exists');
    });

    it('should be disabled unless all checkboxes are checked', () => {
      workflows[0].active = true;
      wrapper = mount(<ApplyForBetaForm project={project} workflows={workflows} />);
      const checkboxes = wrapper.find('input[type="checkbox"]');
      checkboxes.forEach((checkbox, index) => {
        if (index < (checkboxes.length - 1)) checkbox.simulate('change', { target: { checked: true }});
      });
      const button = wrapper.find('button.standard-button').first();
      assert(button.prop('disabled') === true, 'Button is disabled');
    });

    // it('should call the applyFn prop on click if all validations pass', function(done) {
    //   workflows[0].active = true;
    //   mockPages.push({
    //     title: 'Research',
    //     content: 'foobar',
    //   }, {
    //     title: 'FAQ',
    //     content: 'foobar',
    //   });
    //   mockSubjectSets.push({
    //     id: "1",
    //     set_member_subjects_count: 2,
    //   });

    //   wrapper = mount(<ApplyForBetaForm project={project} workflows={workflows} applyFn={applyFn} />);
    //   wrapper.find('input[type="checkbox"]').forEach(function(checkbox) {
    //     checkbox.simulate('change', { target: { checked: true }});
    //   })
    //   wrapper.find('button.standard-button').first().simulate('click');

    //   setTimeout(function() {
    //     assert.ok(applyFn.calledOnce, 'applyFn has been called');
    //     done();
    //   }, 0);
    // });
  });
});
