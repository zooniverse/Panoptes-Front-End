import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import { Intervention } from './Intervention';
import { Markdown } from 'markdownz';
import counterpart from 'counterpart';

describe('Intervention', function () {
  const intervention = { message: 'Hello!' };
  const { message } = intervention;
  const user = {
    id: 'a',
    update: sinon.stub().callsFake(() => {
      return { save: () => true };
    })
  };
  const onUnmount = sinon.stub()

  let wrapper = mount(
    <Intervention
      intervention={intervention}
      onUnmount={onUnmount}
      user={user}
    />);

  it('should render', function () {
    expect(wrapper).to.be.ok;
  });
  it('should show a notification message', () => {
    const newlineMsg = intervention.message + "\n"
    expect(wrapper.find(Markdown).first().text()).to.equal(newlineMsg);
  });
  it('should show an opt-out message', () => {
    const optOutHTML = '<div class="markdown "><p>I do not want to take part in this messaging ' +
      '<a href="https://docs.google.com/document/d/1gLyN6Dgff8dOCOC88f47OD6TtFrfSJltsLgJMKkYMso/preview" ' +
      'target="_blank" ref="noopener nofollow">study</a>. Do not show me further messages.</p>' +
      '\n' + '</div>'
    expect(wrapper.find(Markdown).last().html()).to.equal(optOutHTML);
  });
  it('should show a fallback to english opt-out message', () => {
    counterpart.setLocale('fr');
    const optOutText = 'I do not want to take part in this messaging study. Do not show me further messages.\n'
    expect(wrapper.find(Markdown).last().text()).to.equal(optOutText);
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
