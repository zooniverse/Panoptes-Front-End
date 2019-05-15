import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import { Intervention } from './Intervention';
import { Markdown } from 'markdownz';

describe('Intervention', function () {
  let wrapper;
  const intervention = { message: 'Hello!' };
  const { message } = intervention;
  const user = {
    id: 'a',
    update: sinon.stub().callsFake(() => {
      return { save: () => true };
    })
  };
  const onUnmount = sinon.stub()

  before(function () {
    wrapper = mount(
      <Intervention
        intervention={intervention}
        onUnmount={onUnmount}
        user={user}
      />);
  });
  it('should render', function () {
    expect(wrapper).to.be.ok;
  });
  it('should show a notification message', () => {
    const newlineMsg = intervention.message + "\n"
    expect(wrapper.find(Markdown).text()).to.equal(newlineMsg);
  });
  describe('opt-out checkbox', function () {
    let optOut;
    before(function () {
      optOut = wrapper.find('input[type="checkbox"]');
      optOut.simulate('change');
    });
    after(function () {
      user.update.resetHistory();
    });
    it('should update the user when checked/unchecked', function () {
      expect(user.update.callCount).to.equal(1);
    });
    it('should set the user opt-out preference', function () {
      const changes = { intervention_notifications: true }
      expect(user.update.calledWith(changes)).to.be.true;
    })
  });

  describe('on unmount', function () {
    before(function () {
      wrapper.unmount()
    });

    it('should call onUnmount', function () {
      expect(onUnmount).to.have.been.calledOnce
    })
  })
});
