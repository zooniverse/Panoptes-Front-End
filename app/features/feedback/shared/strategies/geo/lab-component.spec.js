import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import GeoLabComponent from './lab-component';

describe('feedback geo: lab component', function () {
  const formState = {
    defaultTolerance: '15',
    hideSubjectViewer: false,
    id: 'dam-crest'
  };
  const handleInputChange = sinon.spy();
  const wrapper = shallow(<GeoLabComponent formState={formState} handleInputChange={handleInputChange} />);

  it('should explain that geo strategies grade geoDrawing tasks in meters', function () {
    expect(wrapper.find('.form-help').text()).to.include('geoDrawing');
    expect(wrapper.find('.form-help').text()).to.include('meters');
  });

  it('should render the shared tolerance and subject viewer fields', function () {
    const drawing = wrapper.find('LabComponent');
    expect(drawing).to.have.lengthOf(1);
    expect(drawing.prop('formState')).to.equal(formState);
    expect(drawing.prop('handleInputChange')).to.equal(handleInputChange);
  });
});
