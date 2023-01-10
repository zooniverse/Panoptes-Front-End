import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import mockPanoptesResource from '../../../../test/mock-panoptes-resource';
import { TranslationsManager } from '.';
import TranslationTools from './translation-tools';

describe('TranslationsManager', () => {
  let wrapper;

  it('should render with default props', () => {
    wrapper = shallow(<TranslationsManager />);
    expect(wrapper).to.be.ok;
  });

  describe('with no translations', () => {
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
    wrapper = shallow(
      <TranslationsManager
        project={project}
        translations={translations}
      />
    );

    describe('the project primary language', () => {
      const languageMenu = wrapper.find('table');
      const languageInput = languageMenu.find('input[type="checkbox"]');

      it('should be listed', () => {
        expect(languageInput).to.have.lengthOf(1);
      });

      it('should be checked', () => {
        expect(languageInput.prop('checked')).to.be.true;
      });

      it('should be disabled', () => {
        expect(languageInput.prop('disabled')).to.be.true;
      });
    });
  });

  describe('with translations', () => {
    const project = mockPanoptesResource('project',
      {
        configuration: {},
        primary_language: 'en'
      });
    const translations = {
      languages: {
        project: ['en', 'fr', 'es']
      }
    };
    wrapper = shallow(
      <TranslationsManager
        project={project}
        translations={translations}
      />
    );

    describe('the project primary language', () => {
      const languageMenu = wrapper.find('table');
      const languageInput = languageMenu.find('input[type="checkbox"]').first();

      it('should be listed', () => {
        expect(languageInput).to.have.lengthOf(1);
      });

      it('should be checked', () => {
        expect(languageInput.prop('checked')).to.be.true;
      });

      it('should be disabled', () => {
        expect(languageInput.prop('disabled')).to.be.true;
      });
    });

    describe('all translation languages', () => {
      const languageMenu = wrapper.find('table');
      const languageInputs = languageMenu.find('input[type="checkbox"]');
      const translationTools = wrapper.find(TranslationTools);

      it('should be listed', () => {
        expect(languageInputs).to.have.lengthOf(3);
      });

      describe('translated languages', () => {
        const inputs = Array.from(languageInputs);
        inputs.shift();
        inputs.forEach((input) => {
          const language = input.props.value;
          const checked = input.props.checked;
          const disabled = input.props.disabled;
          const tools = translationTools.find({ languageCode: language });
          it(`${language} should not be checked`, () => {
            expect(checked).to.be.false;
          });

          it(`${language} should not be disabled`, () => {
            expect(disabled).to.be.false;
          });

          it(`${language} should have translation tools`, () => {
            expect(tools).to.have.lengthOf(1);
          });
        });
      });
    });
  });

  describe('with approved translations', () => {
    const project = mockPanoptesResource('project',
      {
        configuration: {
          languages: ['en', 'fr']
        },
        primary_language: 'en'
      });
    const translations = {
      languages: {
        project: ['en', 'fr', 'es']
      }
    };
    wrapper = shallow(
      <TranslationsManager
        project={project}
        translations={translations}
      />
    );

    describe('approved languages', () => {
      const languageMenu = wrapper.find('table');
      const languageInputs = languageMenu.find('input[value="fr"]');

      it('should be listed', () => {
        expect(languageInputs).to.have.lengthOf(1);
      });

      describe('translated languages', () => {
        languageInputs.forEach((input) => {
          const language = input.prop('value');
          const checked = input.prop('checked');
          const disabled = input.prop('disabled');
          it(`${language} should be checked`, () => {
            expect(checked).to.be.true;
          });

          it(`${language} should not be disabled`, () => {
            expect(disabled).to.be.false;
          });
        });
      });
    });

    describe('pending languages', () => {
      const languageMenu = wrapper.find('table');
      const languageInputs = languageMenu.find('input[value="es"]');

      it('should be listed', () => {
        expect(languageInputs).to.have.lengthOf(1);
      });

      describe('translated languages', () => {
        languageInputs.forEach((input) => {
          const language = input.prop('value');
          const checked = input.prop('checked');
          const disabled = input.prop('disabled');
          it(`${language} should not be checked`, () => {
            expect(checked).to.be.false;
          });

          it(`${language} should not be disabled`, () => {
            expect(disabled).to.be.false;
          });
        });
      });
    });
  });
});
