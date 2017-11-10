import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import DisplayNameSlugEditor from '../partials/display-name-slug-editor';
import CollectionSettings from './settings';
import Thumbnail from '../components/thumbnail';

const collectionWithDefaultSubject = {
  id: '1',
  default_subject_src: 'subject.png',
  display_name: 'A collection',
  private: false,
  slug: 'username/a-collection'
};

const collectionWithoutDefaultSubject = {
  id: '1',
  display_name: 'A collection',
  private: false,
  slug: 'username/a-collection'
};

describe('<CollectionSettings />', () => {
  let wrapper;
  let confirmationSpy;
  let deleteButton;
  let handleDescriptionInputChangeStub;

  before(() => {
    confirmationSpy = sinon.spy(CollectionSettings.prototype, 'confirmDelete');
    handleDescriptionInputChangeStub = sinon.stub(CollectionSettings.prototype, 'handleDescriptionInputChange');
    wrapper = shallow(<CollectionSettings
      canCollaborate={true}
      collection={collectionWithoutDefaultSubject}
    />,
      { context: { router: {}}}
    );
    deleteButton = wrapper.find('button.error');
  });

  it('should render without crashing', () => {
    assert.equal(wrapper, wrapper);
  });

  it('should render a <DisplayNameSlugEditor /> component', () => {
    assert.equal(wrapper.find(DisplayNameSlugEditor).length, 1);
  });

  it('should render the correct default checked attribute for visibility', () => {
    const privateChecked = wrapper.find('input[type="radio"]').first().props().defaultChecked;
    const publicChecked = wrapper.find('input[type="radio"]').last().props().defaultChecked;
    assert.equal(privateChecked, collectionWithoutDefaultSubject.private);
    assert.notEqual(publicChecked, collectionWithoutDefaultSubject.private);
  });

  it('should render the thumbnail correctly depending on presence of default_subject_src', () => {
    const thumbnailFirstInstance = wrapper.find(Thumbnail);
    assert.equal(thumbnailFirstInstance.length, 0);
    wrapper.setProps({ collection: collectionWithDefaultSubject });
    const thumbnailSecondInstance = wrapper.find(Thumbnail);
    assert.equal(thumbnailSecondInstance.length, 1);
  });

  it('should call this.handleDescriptionInputChange() when a user changes description text', () => {
    wrapper.find('textarea').simulate('change');
    sinon.assert.calledOnce(handleDescriptionInputChangeStub);
  });

  it('should render permission messaging if there is no user', () => {
    wrapper.setProps({ canCollaborate: false, user: null });
    const permissionMessage = wrapper.contains(<p>Not allowed to edit this collection</p>);
    assert(permissionMessage, true);
  });

  it('should call this.confirmDelete() when the delete button is clicked', () => {
    deleteButton.simulate('click');
    sinon.assert.calledOnce(confirmationSpy);
  });
});
