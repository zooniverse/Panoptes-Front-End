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

describe('<CollectionsManager />', () => {
  let wrapper;
  let addToCollectionsSpy;
  let addButton;
  before(() => {
    CollectionsManager.prototype.search = searchNode;
    addToCollectionsSpy = sinon.spy(CollectionsManager.prototype, 'addToCollections');
    wrapper = shallow(<CollectionsManager subjectIDs={subjectIDs} project={project} />);
    addButton = wrapper.find('.search-button');
  });

  after(() => {
    addToCollectionsSpy.restore();
  });

  it('should render without crashing', () => {
    assert.equal(wrapper, wrapper);
  });

  it('should render <CollectionSearch />', () => {
    assert.equal(wrapper.find('CollectionSearch').length, 1);
  });

  it('should render <CollectionsCreateForm />', () => {
    assert.equal(wrapper.find('CollectionsCreateForm').length, 1);
  });

  it('should render the loading indicator if it is adding subjects', () => {
    wrapper.setState({ adding: true });
    assert.equal(wrapper.find('LoadingIndicator').length, 1);
  });

  it('should not render error messages if there is not one', () => {
    assert.equal(wrapper.find('.error').length, 0);
  });

  it('should render error message if there is one', () => {
    wrapper.setState({ errors: ['it broke!'] });
    assert.equal(wrapper.find('.error').length, 1);
  });

  it('calls addToCollections when the add button is clicked', () => {
    addButton.simulate('click');
    sinon.assert.calledOnce(addToCollectionsSpy);
  });

  it('can add a subject to an empty collection', () => {
    const collection = wrapper.instance().search.getSelected()[0].collection;
    const spyGuy = sinon.spy(collection, 'addLink');
    addButton.simulate('click');
    sinon.assert.calledWith(spyGuy, 'subjects', ['1234']);
  });
});
