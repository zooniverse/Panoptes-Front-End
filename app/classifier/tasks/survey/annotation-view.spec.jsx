import { mount } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import React from 'react';
import AnnotationView from './annotation-view';

const annotationValue = {
  answers: {
    bat: ['blue'],
    rat: 'shoe'
  },
  choice: 'dog'
};
const annotation = {
  value: [annotationValue]
};

const onChange = sinon.spy();

const task = {
  choices: {
    cat: { label: 'cat' },
    dog: { label: 'dog' }
  },
  questions: {
    bat: {
      answers: {
        blue: { label: 'blue' }
      }
    },
    rat: {
      answers: {
        shoe: { label: 'shoe' }
      }
    }
  },
  questionsOrder: ['bat', 'rat']
};

describe('AnnotationView render', function() {
  //const handleRemoveStub = sinon.stub(AnnotationView.prototype, 'handleRemove');
  const wrapper = mount(
    <AnnotationView
      annotation={annotation}
      onChange={onChange}
      task={task}
    />
  );

  it('should render without crashing', function() {
    expect(wrapper).to.be.ok;
  })

  it('should render the correct annotation', function() {
    const view = wrapper.find('.survey-identification-proxy');
    const viewText = view.first().text();
    expect(view.length).to.equal(1);
    expect(viewText).to.contain(annotationValue.choice);
  });

  it('should render a delete button', function() {
    const deleteButton = wrapper.find('.survey-identification-remove');
    expect(deleteButton.length).to.equal(1);
  });

  it('should successfully delete itself onClick', function() {
    const deleteButton = wrapper.find('.survey-identification-remove');
    deleteButton.simulate('click');
    expect(onChange.calledOnce).to.be.true;
  });
});
