import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import SVGRenderer from './svg';
import tasks from '../tasks';
import { workflow, subject } from '../../pages/dev-classifier/mock-data';

const viewBoxDimensions = {
  height: 0,
  width: 0,
  x: 0,
  y: 0
};

const naturalHeight = 100;
const naturalWidth = 100;

describe('SVG style', function() {
  let wrapper;

  before(function() {
    const drawingAnnotation = tasks.drawing.getDefaultAnnotation();
    drawingAnnotation.task = 'draw';
    wrapper = shallow(
      <SVGRenderer
        annotation={drawingAnnotation}
        naturalHeight={naturalHeight}
        naturalWidth={naturalWidth}
        subject={subject}
        viewBoxDimensions={viewBoxDimensions}
        workflow={workflow}
      />);
  });

  it('overrides pointer event styles for drawing tasks', function() {
    expect(wrapper.find('svg').prop('style').pointerEvents).to.equal('all');
  });

  it('does not override pointer event styles for question tasks', function() {
    const questionAnnotation = tasks.single.getDefaultAnnotation();
    questionAnnotation.task = 'init';
    wrapper.setProps({annotation: questionAnnotation});
    expect(wrapper.find('svg').prop('style').pointerEvents).to.be.undefined;
  });

  it('overrides pointer event styles for combo drawing tasks', function() {
    const comboAnnotation = tasks.combo.getDefaultAnnotation(workflow.tasks.combo, workflow, tasks);
    comboAnnotation.task = 'combo';
    wrapper.setProps({annotation: comboAnnotation});
    expect(wrapper.find('svg').prop('style').pointerEvents).to.equal('all');
  });

  it('does not override pointer event styles for other combo tasks', function() {
    const comboTask = Object.assign({}, workflow.tasks.combo);
    comboTask.tasks = ['write', 'ask', 'features'];
    workflow.tasks.textCombo = comboTask;
    const comboAnnotation = tasks.combo.getDefaultAnnotation(workflow.tasks.textCombo, workflow, tasks);
    comboAnnotation.task = 'textCombo';
    wrapper.setProps({annotation: comboAnnotation});
    expect(wrapper.find('svg').prop('style').pointerEvents).to.be.undefined;
  });
});