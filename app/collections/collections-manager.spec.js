import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import CollectionsManager from './collections-manager';

const project = {
  id: '342'
};

describe.only('<CollectionsManager />', function() {
  let wrapper;
  const onSuccessSpy = sinon.spy();
  const addToCollectionsSpy = sinon.spy(CollectionsManager.prototype, 'addToCollections');
  before(function() {
    wrapper = shallow(<CollectionsManager onSuccess={onSuccessSpy} project={project} />);
  });

  it('should render without crashing', function() {
    assert.equal(wrapper, wrapper);
  });

  it('should render <CollectionSearch />', function() {
    assert.equal(wrapper.find('CollectionSearch').length, 1);
  });

  it('should render <CollectionsCreateForm />', function() {
    assert.equal(wrapper.find('CollectionsCreateForm').length, 1);
  });

  it('should not render error messages if there are none', function() {
    assert.equal(wrapper.find('.error').length, 0);
  });
});
