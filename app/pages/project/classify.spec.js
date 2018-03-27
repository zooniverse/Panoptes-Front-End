import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';

import { FakeApiClient } from '../../../test/fake-api-client';
import { ProjectClassifyPage } from './classify';
import FinishedBanner from './finished-banner';

describe('ProjectClassifyPage', function () {
  let wrapper;
  let project = {};
  let apiUser = {id: 123};

  before(function () {
    wrapper = shallow(<ProjectClassifyPage project={project} />);
  });

  it('renders when not logged in', function () {
    assert.equal(wrapper.find('.classify-page').length, 1);
  });

  it('never tells you when the project is finished', () => {
    assert.equal(wrapper.find(FinishedBanner).length, 0);
  });
});
