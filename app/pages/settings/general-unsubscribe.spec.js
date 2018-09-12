import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import GeneralUnsubscribe from './general-unsubscribe';

describe('Unsubscribe from all email lists', function () {
  const handleSubmitStub = sinon.stub(GeneralUnsubscribe.prototype, 'handleSubmit').callsFake(() => {});
  let wrapper;

  beforeEach(function () {
    wrapper = shallow(
      <GeneralUnsubscribe
        onSubmit={handleSubmitStub}
      />
    );
  });

  it('renders an unsubscribe from all emails form', function () {
    expect(wrapper.find('form')).to.have.lengthOf(1);
  });

  it('should call handleSubmit on clicking the button', function () {
    wrapper.find('form').simulate('submit');
    expect(handleSubmitStub.calledOnce).to.be.true;
  });
});
