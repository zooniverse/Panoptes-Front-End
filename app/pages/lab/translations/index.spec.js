import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import mockPanoptesResource from '../../../../test/mock-panoptes-resource';
import { TranslationsManager } from './';

describe('TranslationsManager', function () {
  let wrapper = shallow(<TranslationsManager />);
  it('should render with default props', function () {
    expect(wrapper).to.be.ok;
  });

  describe('with no translations', function () {
    const project = mockPanoptesResource('project',
    {
      configuration: {},
      primary_language: 'en'
    });
    const translations = {
      languages: {
        project: ['en']
      }
    };

    before(function () {
      wrapper = shallow(
        <TranslationsManager
          project={project}
          translations={translations}
        />
      );
    });

    describe('the project primary language', function () {
      const languageMenu = wrapper.find('table');
      const languageInput = languageMenu.find('input[type="checkbox"]');

      it('should be listed', function () {
        expect(languageInput).to.have.lengthOf(1);
      });

      it('should be checked', function () {
        expect(languageInput.prop('checked')).to.be.true;
      });

      it('should be disabled', function () {
        expect(languageInput.prop('disabled')).to.be.true;
      });
    });
  });
});
