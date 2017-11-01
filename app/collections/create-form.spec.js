import React from 'react';
import assert from 'assert';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import CollectionsCreateForm from './create-form';

describe('<CollectionsCreateForm />', () => {
  let wrapper;
  let onSubmitSpy;
  let addCollectionButton;

  before(() => {
    onSubmitSpy = sinon.stub(CollectionsCreateForm.prototype, 'onSubmit');
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

  it('calls onSubmit when the add collection button is clicked', () => {
    const event = {};
    wrapper.find('form').simulate('submit', event);
    sinon.assert.calledOnce(onSubmitSpy);
  });
});
