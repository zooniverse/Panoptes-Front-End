import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import { LanguagePicker } from './LanguagePicker';

const options=[
  {
    label: 'English',
    value: 'en'
  },
  {
    label: 'Nederlands',
    value: 'nl'
  }
];

describe('LanguagePicker', function () {
  let wrapper;
  let changeSpy;
  beforeEach(function () {
    changeSpy = sinon.spy()
    const actions = {
      translations: {
        setLocale: changeSpy
      }
    }
    wrapper = shallow(<LanguagePicker actions={actions} options={options} />);
  });

  it('should render with the default props', function () {
    expect(wrapper).to.be.ok;
  });

  describe('onChange', function () {
    beforeEach(function () {
      const fakeEvent = {
        target: {
          value: 'nl'
        }
      };
      wrapper.find('select').simulate('change', fakeEvent);
    });
    afterEach(function () {
      changeSpy.resetHistory();
    });

    it('should call setLocale on change', function () {
      expect(changeSpy.callCount).to.equal(1);
    });

    it('should pass the new language to setLocale', function () {
      expect(changeSpy.calledWith('nl')).to.be.true;
    });
  });
});
