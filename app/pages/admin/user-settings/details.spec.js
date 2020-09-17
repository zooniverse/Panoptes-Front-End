import apiClient from 'panoptes-client/lib/api-client';
import React from 'react';
import assert from 'assert';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import UserDetails from './details';

describe('UserDetails', function () {
    let wrapper;
    let user = {};

    before(function () {
        user = apiClient.type('users').create({
          login: 'test-account',
          display_name: 'Test Account',
          email: 'test@zooniverse.org',
          global_email_communication: false,
          beta_email_communication: true
        })
        sinon.stub(user, 'save');
        wrapper = shallow(<UserDetails user={user} />);
    });

    it('renders without crashing', function () {
        const container = wrapper.find('div.user-details');
        assert.equal(container.length, 1);
    });

    describe('email preferences', function () {
      it('should list general email preferences', function () {
        const generalPrefs = wrapper.find('input[name="global_email_communication"]');
        expect(generalPrefs.props().checked).to.be.false;
      })

      it('should list beta email preferences', function () {
        const betaPrefs = wrapper.find('input[name="beta_email_communication"]');
        expect(betaPrefs.props().checked).to.be.true;
      })

      describe('global email preference change', function () {
        before(function () {
          const generalPrefs = wrapper.find('input[name="global_email_communication"]');
          const target = {
            checked: true,
            name: 'global_email_preferences',
            type: 'checkbox'
          }
          generalPrefs.simulate('change', { target });
        })

        after(function () {
          user.save.resetHistory()
        })

        it('should update general email preferences', function () {
          expect(!!user.global_email_preferences).to.be.true;
        })

        it('should save general email preferences', function () {
          expect(user.save).to.have.been.calledOnce;
        })
      })

      describe('beta email preference change', function () {
        before(function () {
          const betaPrefs = wrapper.find('input[name="beta_email_communication"]');
          const target = {
            checked: false,
            name: 'beta_email_preferences',
            type: 'checkbox'
          }
          betaPrefs.simulate('change', { target });
        })

        after(function () {
          user.save.resetHistory()
        })

        it('should update beta email preferences', function () {
          expect(!!user.beta_email_preferences).to.be.false;
        })

        it('should save beta email preferences', function () {
          expect(user.save).to.have.been.calledOnce;
        })
      })
    })
});
