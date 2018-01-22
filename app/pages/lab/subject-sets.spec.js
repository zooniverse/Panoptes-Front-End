import React from 'react';
import assert from 'assert';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import SubjectSetsPage from './subject-sets';

const meta = function () {
  return { meta: { page: 1, page_size: 1 }};
};

const subjectSets = [
  { id: '1', display_name: 'Rad Subject Set', getMeta: meta },
  { id: '2', display_name: 'Cool Subject Set', getMeta: meta }
];

describe('SubjectSetsPage', function () {
  let wrapper;
  const newSubjectSet = sinon.spy();

  before(function () {
    wrapper = shallow(
      <SubjectSetsPage
        labPath={(url) => { return url; }}
        createNewSubjectSet={newSubjectSet}
      />
    );
    wrapper.setProps({ loading: false });
  });

  it('will display a message when no subject sets are present', function () {
    const message = 'No subject sets are currently associated with this project.';
    assert.equal(wrapper.contains(<p>{message}</p>), true);
  });

  it('will display the correct amount of subject sets', function () {
    wrapper.setProps({ subjectSets });
    assert.equal(wrapper.find('Link').length, 2);
  });

  it('should call the subject set create handler', function () {
    wrapper.find('button').simulate('click');
    sinon.assert.called(newSubjectSet);
  });

  it('will display a paginator', function () {
    assert.equal(wrapper.find('Paginator').length, 1);
  });
});
