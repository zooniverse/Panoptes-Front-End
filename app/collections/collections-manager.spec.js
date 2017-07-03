import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import CollectionsManager from './collections-manager';

const project = {
  id: '342'
};

describe('<CollectionsManager />', function() {
  let wrapper;
  let addToCollectionsSpy;
  before(function() {
    addToCollectionsSpy = sinon.stub(CollectionsManager.prototype, 'addToCollections');
    wrapper = shallow(<CollectionsManager project={project} />);
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

  it('should not render error messages if there is not one', function() {
    assert.equal(wrapper.find('.error').length, 0);
  });

  it('should render error message if there is one', function() {
    wrapper.setState({ error: 'it broke!' });
    assert.equal(wrapper.find('.error').length, 1);
  });

  it('calls addToCollections when the add button is clicked', function() {
    const addButton = wrapper.find('.search-button');
    addButton.simulate('click');
    sinon.assert.calledOnce(addToCollectionsSpy);
  });
});
