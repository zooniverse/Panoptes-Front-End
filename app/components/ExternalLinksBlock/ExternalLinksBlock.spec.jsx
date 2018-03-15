import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import Translate from 'react-translate-component';
import ExternalLinksBlock, { StyledExternalLinksBlock, StyledExternalLink } from './ExternalLinksBlock';
import { externalLinks } from '../../../test';

describe('ExternalLinksBlock', function() {
  let wrapper;
  before(function() {
    wrapper = shallow(
      <ExternalLinksBlock
        header={<Translate content="project.home.links" />}
        links={externalLinks}
        resource={{ workflow_description: '' }}
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
