import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import ExternalLinksBlock, { StyledExternalLinksBlock, StyledExternalLink } from './ExternalLinksBlock';
import { externalLinks } from '../testHelpers';

describe('ExternalLinksBlock', function() {
  let wrapper;
  before(function() {
    wrapper = shallow(
      <ExternalLinksBlock
        links={externalLinks}
      />
    );
  });

  it('should render without crashing', function() {});

  it('should use a ThemeProvider', function() {
    expect(wrapper.find('ThemeProvider')).to.have.lengthOf(1);
  });

  it('should render a StyledExternalLinksBlock component', function() {
    expect(wrapper.find(StyledExternalLinksBlock)).to.have.lengthOf(1);
  });

  it('should render StyledExternalLink components equal to the length of the links prop', function() {
    expect(wrapper.find(StyledExternalLink)).to.have.lengthOf(externalLinks.length);
  });

  it('should render a Translate component for the header', function() {
    expect(wrapper.find('Translate')).to.have.lengthOf(1);
  });
});
