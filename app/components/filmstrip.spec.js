import React from 'react';
import assert from 'assert';
import sinon from 'sinon';
import { mount } from 'enzyme';
import Filmstrip from './filmstrip';

describe('if loading an image subject', () => {
  let wrapper;
  let positionSpy;
  let filterChange;

  before(() => {
    filterChange = sinon.spy(Filmstrip.prototype, 'selectFilter');
    positionSpy = sinon.spy(Filmstrip.prototype, 'scrollRight');
    wrapper = mount(<Filmstrip increment={350} onChange={function (a) { return a; }} value="" />);
  });

  after(() => {
    filterChange.restore();
    positionSpy.restore();
  });

  it('will show all disciplines without a filter value', () => {
    const allDisciplines = wrapper.find('button').at(1);
    allDisciplines.simulate('click');
    sinon.assert.calledWith(filterChange, '');
  });

  it('will activate the correct discipline', () => {
    wrapper.setProps({ value: 'arts' });
    const arts = wrapper.find('button').at(2);
    arts.simulate('click');
    assert.equal(arts.hasClass('filmstrip--disciplines__discipline-card--active'), true);
  });

  it('will scroll through project disciplines', () => {
    wrapper.find('button').last().simulate('click');
    sinon.assert.calledOnce(positionSpy);
  });
});
