import React from 'react';
import assert from 'assert';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import SubjectSetsPage from './subject-sets';

const meta = () => {
  return { meta: { page: 1, page_size: 1 }};
};

const subjectSets = [
  { id: '1', display_name: 'Rad Subject Set', getMeta: meta },
  { id: '2', display_name: 'Cool Subject Set', getMeta: meta }
];

const context = { router: {}};

describe('SubjectSetsPage', function () {
  let wrapper;

  before(function () {
    wrapper = shallow(
      <SubjectSetsPage />,
      { disableLifecycleMethods: true, context }
    );
    wrapper.setState({ loading: false });
  });

  it('will display a message when no subject sets are present', function () {
    const message = 'No subject sets are currently associated with this project.';
    assert.equal(wrapper.find('p').text(), message);
  });

  it('will display the correct amount of subject sets', function () {
    wrapper.setState({ subjectSets });
    assert.equal(wrapper.find('Link').length, 2);
  });

  it('will display a paginator', function () {
    wrapper.setState({ subjectSets });
    assert.equal(wrapper.find('Paginator').length, 1);
  });

  it('will allow for the creation of a new subject set', function () {
    const newSubjectStub = sinon.stub(wrapper.instance(), 'createNewSubjectSet');
    wrapper.instance().forceUpdate();
    wrapper.update();
    wrapper.find('button').simulate('click');
    sinon.assert.called(newSubjectStub);
  });
});
