import React from 'react';
import assert from 'assert';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import CollectionsCreateForm from './create-form';

describe('<CollectionsCreateForm />', () => {
  let addCollectionButton;
  let handleDescriptionInputChangeStub;
  let handleNameInputChangeStub;
  let onSubmitStub;
  let wrapper;

  before(() => {
    handleDescriptionInputChangeStub = sinon.stub(CollectionsCreateForm.prototype, 'handleDescriptionInputChange');
    handleNameInputChangeStub = sinon.stub(CollectionsCreateForm.prototype, 'handleNameInputChange');
    onSubmitStub = sinon.stub(CollectionsCreateForm.prototype, 'onSubmit');

    wrapper = shallow(<CollectionsCreateForm />);
  });

  it('should render without crashing', () => {
    assert.equal(wrapper, wrapper);
  });

  describe('should render a disabled submit button', () => {
    it('when there is no text in the name input', () => {
      wrapper.setState({
        collectionNameLength: 0
      });
      addCollectionButton = wrapper.find('button');
      assert.equal(addCollectionButton.prop('disabled'), true);
    });

    it('when name input is valid but description text is more than 300 characters', () => {
      wrapper.setState({
        collectionNameLength: 5,
        descriptionText: 'this is a test description that is more than 300 characters in length. this is a test description that is more than 300 characters in length. this is a test description that is more than 300 characters in length. this is a test description that is more than 300 characters in length. this is a test description that is more than 300 characters in length.' // eslint-disable-line max-len
      });
      addCollectionButton = wrapper.find('button');
      assert.equal(addCollectionButton.prop('disabled'), true);
    });
  });

  it('should render an enabled submit button when name and description are valid', () => {
    wrapper.setState({
      collectionNameLength: 5,
      descriptionText: 'valid description text length'
    });
    addCollectionButton = wrapper.find('button');
    assert.equal(addCollectionButton.prop('disabled'), false);
  });

  describe('event handlers', () => {
    it('should call #onSubmit when the add collection button is clicked', () => {
      wrapper.find('form').simulate('submit');
      sinon.assert.calledOnce(onSubmitStub);
    });

    it('should call #handleNameInputChange when a user changes text in the name input', () => {
      wrapper.find('input.collection-name-input').simulate('change');
      sinon.assert.calledOnce(handleNameInputChangeStub);
    });

    it('should call #handleDescriptionInputChange when a user changes text in the description input', () => {
      wrapper.find('textarea.collection-name-input').simulate('change');
      sinon.assert.calledOnce(handleDescriptionInputChangeStub);
    });
  });

  describe('should handle errors', () => {
    it('when there is an error', () => {
      wrapper.setState({ error: ['it broke!'] });
      assert.equal(wrapper.find('.error').length, 1);
    });

    it('when a user tries to enter a duplicate collection name ', () => {
      wrapper.setState({
        error: {
          status: 400
        }
      });
      const errorMessage = wrapper.find('.error');
      assert.equal(errorMessage.text(), 'You can\'t name two collections the same thing!');
    });
  });
});
