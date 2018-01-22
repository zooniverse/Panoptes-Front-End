/* eslint prefer-arrow-callback: 0, func-names: 0, 'react/jsx-filename-extension': [1, { "extensions": [".js", ".jsx"] }] */

import React from 'react';
import assert from 'assert';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import CollectionsCreateForm from './collections-create-form';

describe('<CollectionsCreateForm />', function () {
  let addCollectionButton;
  let handleDescriptionInputChangeStub;
  let handleNameInputChangeStub;
  let onSubmitStub;
  let wrapper;

  before(function () {
    handleDescriptionInputChangeStub = sinon.stub(CollectionsCreateForm.prototype, 'handleDescriptionInputChange');
    handleNameInputChangeStub = sinon.stub(CollectionsCreateForm.prototype, 'handleNameInputChange');
    onSubmitStub = sinon.stub(CollectionsCreateForm.prototype, 'onSubmit');
    wrapper = shallow(<CollectionsCreateForm />);
  });

  after(function () {
    handleDescriptionInputChangeStub.restore();
    handleNameInputChangeStub.restore();
    onSubmitStub.restore();
  });

  it('should render without crashing', function () {
    assert.equal(wrapper, wrapper);
  });

  describe('should render a disabled submit button', function () {
    it('when there is no text in the name input', function () {
      addCollectionButton = wrapper.find('button');
      assert.equal(addCollectionButton.prop('disabled'), true);
    });

    it('when name input is valid but description text is more than 300 characters', function () {
      wrapper.setState({
        collectionNameLength: 5,
        description: 'this is a test description that is more than 300 characters in length. this is a test description that is more than 300 characters in length. this is a test description that is more than 300 characters in length. this is a test description that is more than 300 characters in length. this is a test description that is more than 300 characters in length.' // eslint-disable-line max-len
      });
      addCollectionButton = wrapper.find('button');
      assert.equal(addCollectionButton.prop('disabled'), true);
    });
  });

  describe('should render an enabled submit button', function () {
    it('when name is valid and there is no description', function () {
      wrapper.setState({
        description: ''
      });
      addCollectionButton = wrapper.find('button');
      assert.equal(addCollectionButton.prop('disabled'), false);
    });

    it('when name and description are valid', function () {
      wrapper.setState({
        description: 'valid description text length'
      });
      addCollectionButton = wrapper.find('button');
      assert.equal(addCollectionButton.prop('disabled'), false);
    });
  });

  describe('event handlers', function () {
    it('should call #onSubmit when the add collection button is clicked', function () {
      wrapper.find('form').simulate('submit');
      sinon.assert.calledOnce(onSubmitStub);
    });

    it('should call #handleNameInputChange when a user changes text in the name input', function () {
      wrapper.find('input.collection-create-form__input--name').simulate('change');
      sinon.assert.calledOnce(handleNameInputChangeStub);
    });

    it('should call #handleDescriptionInputChange when a user changes text in the description input', function () {
      wrapper.find('textarea.collection-create-form__input--description').simulate('change');
      sinon.assert.calledOnce(handleDescriptionInputChangeStub);
    });
  });

  describe('should handle errors', function () {
    it('when there is an error', function () {
      wrapper.setState({
        error: {
          status: 404,
          message: 'bad request'
        }
      });
      assert.equal(wrapper.find('.error').length, 1);
    });

    it('when a user tries to enter a duplicate collection name ', function () {
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
