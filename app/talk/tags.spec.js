import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon'
import TalkTags from './tags';

const location = {
  query: {}
}

const params = {
  name: 'snapshot-cats',
  owner: 'zooniverse',
  tag: 'cats'
}

const project = {
  id: '1',
  slug: 'zooniverse/snapshot-cats'
}

describe('TalkTags', function () {
  it('should render without crashing', function () {
    const wrapper = shallow(
      <TalkTags location={location} params={params} project={project} />,
      { context: { router: { goBack: () => {} } }, disableLifecycleMethods: true }
    );
    expect(wrapper).to.be.ok
  })
});
