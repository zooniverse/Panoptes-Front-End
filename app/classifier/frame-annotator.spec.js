// "Passing arrow functions (“lambdas”) to Mocha is discouraged" - https://mochajs.org/#arrow-functions
/* eslint prefer-arrow-callback: 0, func-names: 0, 'react/jsx-boolean-value': ['error', 'always'] */
/* global describe, it, beforeEach, before */

import React from 'react';
import assert from 'assert';
import sinon from 'sinon';
import { shallow, mount } from 'enzyme';
import FrameAnnotator from './frame-annotator';
import tasks from './tasks';
import WarningBanner from './warning-banner';
import { classification, workflow, subject, preferences } from '../pages/dev-classifier/mock-data';

const annotation = {
  task: 'init'
};

const viewBoxDimensions = {
  height: 0,
  width: 0,
  x: 0,
  y: 0
};

const naturalHeight = 100;
const naturalWidth = 100;

describe('<FrameAnnotator />', function() {
  it('should render without crashing', function() {
    return shallow(
      <FrameAnnotator
        annotation={annotation}
        classification={classification}
        loading={false}
        naturalHeight={naturalHeight}
        naturalWidth={naturalWidth}
        subject={subject}
        viewBoxDimensions={viewBoxDimensions}
        workflow={workflow}
      />);
  });

  it('should render children nodes', function() {
    const wrapper = shallow(
      <FrameAnnotator
        annotation={annotation}
        classification={classification}
        loading={false}
        naturalHeight={naturalHeight}
        naturalWidth={naturalWidth}
        subject={subject}
        viewBoxDimensions={viewBoxDimensions}
        workflow={workflow}
      ><span>child</span></FrameAnnotator>);
    assert.equal(wrapper.find('span').length, 1);
  });

  describe('<AnnotationRenderer />', function() {
    let wrapper;
    before(function() {
      wrapper = shallow(
        <FrameAnnotator
          annotation={annotation}
          classification={classification}
          loading={false}
          naturalHeight={naturalHeight}
          naturalWidth={naturalWidth}
          subject={subject}
          viewBoxDimensions={viewBoxDimensions}
          workflow={workflow}
        />);
    });

    it('renders with correct subject type for images', function() {
      const { type } = wrapper.find('AnnotationRenderer').props();
      assert.equal(type, 'image');
    });

    it('renders with correct subject type for video', function() {
      const newSubject = Object.assign({}, subject);
      newSubject.locations = [{ 'video/mp4': 'video.mp4' }];
      wrapper.setProps({ subject: newSubject });

      const { type } = wrapper.find('AnnotationRenderer').props();
      assert.equal(type, 'video');
    });
  });

  describe('<WarningBanner />', function() {
    let wrapper;
    beforeEach(function() {
      subject.already_seen = false;
      subject.retired = false;
      wrapper = shallow(
        <FrameAnnotator
          annotation={annotation}
          classification={classification}
          loading={false}
          naturalHeight={naturalHeight}
          naturalWidth={naturalWidth}
          subject={subject}
          viewBoxDimensions={viewBoxDimensions}
          workflow={workflow}
        />);
    });

    it('renders if subject is already seen', function() {
      subject.already_seen = true;
      // Recalling the shallow mounting was needed to trigger componentWillMount.
      // Couldn't get wrapper.unmount() and wrapper.mount() to work
      wrapper = shallow(
        <FrameAnnotator
          annotation={annotation}
          classification={classification}
          loading={false}
          naturalHeight={naturalHeight}
          naturalWidth={naturalWidth}
          subject={subject}
          viewBoxDimensions={viewBoxDimensions}
          workflow={workflow}
        />);

      assert.equal(wrapper.find(WarningBanner).length, 1);
    });

    it('renders if subject is retired', function() {
      subject.retired = true;
      wrapper.setProps({ subject });

      assert.equal(wrapper.find(WarningBanner).length, 1);
    });

    it('does not render renders for normal subjects', function() {
      assert.equal(wrapper.find(WarningBanner).length, 0);
    });
  });

  describe('task hooks', function() {
    let TaskComponent;
    let wrapper;

    before(function() {
      // combo task has BeforeSubject, InsideSubject, and AfterSubject hooks
      const comboAnnotation = { task: 'combo' };
      TaskComponent = tasks[comboAnnotation.task];
      wrapper = shallow(
        <FrameAnnotator
          annotation={comboAnnotation}
          classification={classification}
          loading={false}
          naturalHeight={naturalHeight}
          naturalWidth={naturalWidth}
          subject={subject}
          viewBoxDimensions={viewBoxDimensions}
          workflow={workflow}
        />);
    });

    it('renders BeforeSubject hook', function() {
      assert.equal(wrapper.find(TaskComponent.BeforeSubject).length, 1);
    });

    it('renders AfterSubject hook', function() {
      assert.equal(wrapper.find(TaskComponent.AfterSubject).length, 1);
    });
  });
});
