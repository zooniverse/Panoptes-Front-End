import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import ExternalLinksBlockContainer from './ExternalLinksBlockContainer';
import { projectWithoutRedirect } from '../../../test';

describe('ExternalLinksBlockContainer', function() {
  let wrapper;
  let getExternalLinksSpy;
  before(function() {
    getExternalLinksSpy = sinon.spy(ExternalLinksBlockContainer.prototype, 'getExternalLinks');
    getExternalLinksSpy.resetHistory();
    wrapper = shallow(<ExternalLinksBlockContainer resource={{ id: '1' }} />);
  });

  after(function() {
    getExternalLinksSpy.restore();
  });

  it('should call getExternalLinks on render', function () {
    expect(getExternalLinksSpy.calledOnce).to.be.true;
  });

  it('should render null of the links length is 0', function() {
    expect(wrapper.html()).to.be.null;
  });

  it('should render ExternalLinksBlock if the links length is greater than 0', function() {
    wrapper.setProps({ resource: projectWithoutRedirect });
    expect(wrapper.find('ExternalLinksBlock')).to.have.lengthOf(1);
  });
});
