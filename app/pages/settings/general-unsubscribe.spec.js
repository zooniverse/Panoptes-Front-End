import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import GeneralUnsubscribe from './general-unsubscribe';

describe('Unsubscribe from all email lists', function () {
  const handleSubmitSpy = sinon.spy();
  let wrapper;

  before(function () {
    wrapper = shallow(
      <GeneralUnsubscribe
        onSubmit={handleSubmitSpy}
      />
    );
  });

  it('renders an unsubscribe from all emails form', function () {
    wrapper.setProps({ user: null });
    expect(wrapper.find('form')).to.have.lengthOf(1);
  });

  it('should call handleSubmit on clicking the button', function () {
    wrapper.find('form').simulate('submit', { preventDefault() {} });
    expect(handleSubmitSpy.calledOnce).to.be.true;
  });
});
