import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import apiClient from 'panoptes-client/lib/api-client';
import CollectionsManager from './collections-manager';

const project = {
  id: '342'
};

const selectedCollection = [{
  collection: apiClient.type('collections').create({
    display_name: 'test collection',
    description: '',
    private: false,
    links: { project: '1234' }
  })
}];

const subjectIDs = ['1234'];

const searchNode = {
  getSelected() { return selectedCollection; }
};

describe('<CollectionsManager />', function () {
  let wrapper;
  let addToCollectionsSpy;
  let addButton;
  before(function() {
    CollectionsManager.prototype.search = searchNode;
    addToCollectionsSpy = sinon.spy(CollectionsManager.prototype, 'addToCollections');
    wrapper = shallow(<CollectionsManager subjectIDs={subjectIDs} project={project} />);
    addButton = wrapper.find('.search-button');
  });

  after(function () {
    addToCollectionsSpy.restore();
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

  it('should render the loading indicator if it is adding subjects', function() {
    wrapper.setState({ adding: true });
    assert.equal(wrapper.find('LoadingIndicator').length, 1);
  });

  it('should not render error messages if there is not one', function() {
    assert.equal(wrapper.find('.error').length, 0);
  });

  it('should render error message if there is one', function() {
    wrapper.setState({ errors: ['it broke!'] });
    assert.equal(wrapper.find('.error').length, 1);
  });

  it('calls addToCollections when the add button is clicked', function() {
    addButton.simulate('click');
    sinon.assert.calledOnce(addToCollectionsSpy);
  });

  it('can add a subject to an empty collection', function() {
    const collection = wrapper.instance().search.getSelected()[0].collection;
    const spyGuy = sinon.spy(collection, 'addLink');
    addButton.simulate('click');
    sinon.assert.calledWith(spyGuy, 'subjects', ['1234']);
  });
});
