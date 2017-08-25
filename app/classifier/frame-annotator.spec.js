// "Passing arrow functions (“lambdas”) to Mocha is discouraged" - https://mochajs.org/#arrow-functions
/* eslint prefer-arrow-callback: 0, func-names: 0, 'react/jsx-boolean-value': ['error', 'always'] */
/* global describe, it, beforeEach, before */

import React from 'react';
import assert from 'assert';
import sinon from 'sinon';
import { shallow, mount } from 'enzyme';
import FrameAnnotator from './frame-annotator';
import tasks from './tasks';
import SVGImage from '../components/svg-image';
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

  describe('<SVGImage />', function() {
    let wrapper;
    before(function() {
      wrapper = mount(
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

    it('renders if subject type is an image', function() {
      assert.equal(wrapper.find(SVGImage).length, 1);
    });

    it('does not render if type is not an image', function() {
      const newSubject = Object.assign({}, subject);
      newSubject.locations = [{ 'video/mp4': 'video.mp4' }];
      wrapper.setProps({ subject: newSubject });

      assert.equal(wrapper.find(SVGImage).length, 0);
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

    it('renders InsideSubject hook', function() {
      TaskComponent = tasks['drawing'];
      const drawingAnnotation = TaskComponent.getDefaultAnnotation();
      drawingAnnotation.task = 'draw';
      wrapper = mount(
        <FrameAnnotator
          annotation={drawingAnnotation}
          classification={classification}
          loading={false}
          naturalHeight={naturalHeight}
          naturalWidth={naturalWidth}
          subject={subject}
          viewBoxDimensions={viewBoxDimensions}
          workflow={workflow}
        />);

      assert.equal(wrapper.find(TaskComponent.InsideSubject).length, 1);
    });

    it('renders PersistInsideSubject hook', function() {
      // combo tasks each have their own PersistInsideSubject, so this can be greater than 1
      assert(wrapper.find(TaskComponent.PersistInsideSubject).length >= 1);
    });
  });
  
  describe('SVG style', function() {
    let wrapper;

    before(function() {
      const drawingAnnotation = tasks.drawing.getDefaultAnnotation();
      drawingAnnotation.task = 'draw';
      wrapper = mount(
        <FrameAnnotator
          annotation={drawingAnnotation}
          classification={classification}
          loading={false}
          naturalHeight={naturalHeight}
          naturalWidth={naturalWidth}
          subject={subject}
          viewBoxDimensions={viewBoxDimensions}
          workflow={workflow}
        />);
    });

    it('overrides pointer event styles for drawing tasks', function() {
      assert(wrapper.find('svg').prop('style').pointerEvents === 'all');
    });

    it('does not override pointer event styles for question tasks', function() {
      const questionAnnotation = tasks.single.getDefaultAnnotation();
      questionAnnotation.task = 'init';
      wrapper.setProps({annotation: questionAnnotation});
      assert(wrapper.find('svg').prop('style').pointerEvents === undefined);
    });

    it('overrides pointer event styles for combo drawing tasks', function() {
      const comboAnnotation = tasks.combo.getDefaultAnnotation(workflow.tasks.combo, workflow, tasks);
      comboAnnotation.task = 'combo';
      wrapper.setProps({annotation: comboAnnotation});
      assert(wrapper.find('svg').prop('style').pointerEvents === 'all');
    });

    it('does not override pointer event styles for other combo tasks', function() {
      const comboTask = Object.assign({}, workflow.tasks.combo);
      comboTask.tasks = ['write', 'ask', 'features'];
      workflow.tasks.textCombo = comboTask;
      const comboAnnotation = tasks.combo.getDefaultAnnotation(workflow.tasks.textCombo, workflow, tasks);
      comboAnnotation.task = 'textCombo';
      wrapper.setProps({annotation: comboAnnotation});
      assert(wrapper.find('svg').prop('style').pointerEvents === undefined);
    });
  });
});
