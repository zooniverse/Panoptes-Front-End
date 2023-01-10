import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import { LanguagePicker } from './LanguagePicker';

const project = {
  configuration: {
    languages: ['en', 'nl']
  }
};

describe('LanguagePicker', () => {
  let wrapper;
  let changeSpy;
  beforeEach(() => {
    changeSpy = sinon.spy();
    const actions = {
      translations: {
        setLocale: changeSpy
      }
    };
    wrapper = shallow(<LanguagePicker actions={actions} project={project} />);
  });

  it('should render with the default props', () => {
    expect(wrapper).to.be.ok;
  });

  describe('onChange', () => {
    beforeEach(() => {
      const fakeEvent = {
        target: {
          value: 'nl'
        }
      };
      wrapper.find('select').simulate('change', fakeEvent);
    });
    afterEach(() => {
      changeSpy.resetHistory();
    });

    it('should call setLocale on change', () => {
      expect(changeSpy.callCount).to.equal(1);
    });

    it('should pass the new language to setLocale', () => {
      expect(changeSpy.calledWith('nl')).to.be.true;
    });

    it('should add the new language to the page URL', () => {
      const searchParams = new URLSearchParams(window.location.search);
      expect(searchParams.get('language')).to.equal('nl');
    });
  });
});
