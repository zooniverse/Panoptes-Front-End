import React from 'react';
import assert from 'assert';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import CollectionsCreateForm from './create-form';

describe('<CollectionsCreateForm />', () => {
  let wrapper;
  let onSubmitStub;
  let addCollectionButton;
  let handleNameInputChangeStub;

  before(() => {
    onSubmitStub = sinon.stub(CollectionsCreateForm.prototype, 'onSubmit');
    handleNameInputChangeStub = sinon.stub(CollectionsCreateForm.prototype, 'handleNameInputChange');

    wrapper = shallow(<CollectionsCreateForm />);
  });

  it('should render without crashing', () => {
    assert.equal(wrapper, wrapper);
  });

  it('renders a disabled button when there is no text in the input', () => {
    addCollectionButton = wrapper.find('button');
    assert.equal(addCollectionButton.prop('disabled'), true);
  });

  it('renders a submit button when there is text in the input', () => {
    wrapper.setState({ collectionNameLength: 5 });
    addCollectionButton = wrapper.find('button');
    assert.equal(addCollectionButton.prop('disabled'), false);
  });

  it('calls #onSubmit when the add collection button is clicked', () => {
    wrapper.find('form').simulate('submit');
    sinon.assert.calledOnce(onSubmitStub);
  });

  it('calls #handleNameInputChange when a user changes text in the name input', () => {
    wrapper.find('input.collection-name-input').simulate('change');
    sinon.assert.calledOnce(handleNameInputChangeStub);
  });
});
