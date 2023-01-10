import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import React from 'react';
import { AnnotationView } from './annotation-view';

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

const onChange = sinon.stub().callsFake(annotations => annotations);

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

describe('AnnotationView', () => {
  const wrapper = shallow(
    <AnnotationView
      annotation={annotation}
      onChange={onChange}
      task={task}
      translation={task}
    />
  );

  describe('AnnotationView render', () => {
    it('should render without crashing', () => {
      expect(wrapper).to.be.ok;
    });

    it('should render the correct annotation', () => {
      const view = wrapper.find('.survey-identification-proxy');
      const viewText = view.first().text();
      expect(view.length).to.equal(1);
      expect(viewText).to.contain(annotationValue.choice);
    });

    it('should render a delete button', () => {
      const deleteButton = wrapper.find('.survey-identification-remove');
      expect(deleteButton.length).to.equal(1);
    });
  });

  describe('The delete button', () => {
    it('should call the onChange callback', () => {
      const deleteButton = wrapper.find('.survey-identification-remove');
      deleteButton.simulate('click', {
        target: {
          dataset: {
            index: 0
          }
        }
      });
      expect(onChange.calledOnce).to.be.true;
    });

    it('should delete the selected annotation onClick', () => {
      const returnValues = onChange.returnValues[0];
      wrapper.setProps({ annotation: returnValues });
      const view = wrapper.find('.survey-identification-proxy');
      expect(view.length).to.equal(0);
    });
  });
});
