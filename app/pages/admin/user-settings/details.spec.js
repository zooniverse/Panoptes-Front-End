import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import UserDetails from './details';

describe('UserDetails', function () {
    let wrapper;
    let user = {};

    before(function () {
        wrapper = shallow(<UserDetails user={user} />);
    });

    it('renders without crashing', function () {
        const container = wrapper.find('div.user-details');
        assert.equal(container.length, 1);
    });
});
