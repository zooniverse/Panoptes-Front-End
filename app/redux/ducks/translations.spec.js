import apiClient from 'panoptes-client/lib/api-client';
import { expect } from 'chai';
import counterpart from 'counterpart';
import sinon from 'sinon';
import mockPanoptesResource from '../../../test/mock-panoptes-resource';
import reducer, { load, listLanguages, setLocale } from './translations';

describe('translations actions', function () {
  let state;
  let newState;
  const initialState = {
    locale: 'en',
    languages: {
      project: []
    },
    rtl: false,
    strings: {
      project: {},
      workflow: {},
      tutorial: {},
      minicourse: {},
      field_guide: {},
      project_page: {}
    }
  };
  const fakeDispatch = sinon.stub().callsFake(function (action) {
    if (typeof action === 'function') {
      action = action(fakeDispatch);
    }
    return reducer(state, action);
  });

  const fakeTranslation = mockPanoptesResource('translations', {
    id: '456',
    translated_type: 'Workflow',
    translated_id: '123',
    strings: {
      'tasks.T0.question': 'How are you?',
      'tasks.T0.answers.0.label': 'Good',
      'tasks.T0.answers.1.label': 'Bad'
    }
  });

  before(function () {
    sinon.stub(counterpart, 'setLocale');
  });

  after(function () {
    counterpart.setLocale.restore();
  });

  beforeEach(function () {
    state = initialState;
  });

  describe('load', function () {
    let awaitTranslations;

    before(function () {
      sinon.stub(apiClient, 'type').callsFake(function (type) {
        return {
          get: sinon.stub().callsFake(function () {
            return Promise.resolve([fakeTranslation]);
          })
        };
      });
      awaitTranslations = load('workflow', '123', 'es')(fakeDispatch);
    });

    after(function () {
      apiClient.type.restore();
      counterpart.setLocale.resetHistory();
      fakeDispatch.resetHistory();
    });

    it('should set the counterpart locale', function () {
      expect(counterpart.setLocale).to.have.been.calledOnce;
      expect(counterpart.setLocale).to.have.been.calledWith('es');
    });

    it('should dispatch a load action', function () {
      const load = {
        type: 'pfe/translations/LOAD',
        translated_type: 'workflow',
        translated_id: '123',
        language: 'es'
      };
      expect(fakeDispatch.firstCall).to.have.been.calledWith(load);
    });

    it('should load the expected translation', function (done) {
      awaitTranslations.then(function (newState) {
        expect(newState.strings.workflow['123'].id).to.equal(fakeTranslation.id);
      })
      .then(done, done);
    });

    it('should explode translation strings into nested objects for backwards compatibility with old projects', function (done) {
      const tasks = {
        T0: {
          question: fakeTranslation.strings['tasks.T0.question'],
          answers: {
            0: {
              label: fakeTranslation.strings['tasks.T0.answers.0.label']
            },
            1: {
              label: fakeTranslation.strings['tasks.T0.answers.1.label']
            }
          }
        }
      };
      awaitTranslations.then(function (newState) {
        expect(newState.strings.workflow['123'].strings.tasks).to.deep.equal(tasks);
      })
      .then(done, done);
    });

    it('should not change state', function () {
      expect(state).to.deep.equal(initialState);
    });
  });

  describe('listLanguages', function () {
    let awaitLanguages;
    const fakeTranslations = [
      { language: 'es'},
      { language: 'en'}
    ];

    before(function () {
      sinon.stub(apiClient, 'type').callsFake(function (type) {
        return {
          get: sinon.stub().callsFake(function () {
            return Promise.resolve(fakeTranslations);
          })
        };
      });
      awaitLanguages = listLanguages('project', '123')(fakeDispatch);
    });

    after(function () {
      apiClient.type.restore();
      fakeDispatch.resetHistory();
    });

    it('should dispatch a load action', function () {
      const load = {
        type: 'pfe/translations/LOAD',
        translated_type: 'project',
        translated_id: '123'
      };
      expect(fakeDispatch.firstCall).to.have.been.calledWith(load);
    });

    it('should list the expected languages', function (done) {
      awaitLanguages.then(function (newState) {
        expect(newState.languages.project).to.deep.equal(['es', 'en']);
      })
      .then(done, done);
    });

    it('should not change state', function () {
      expect(state).to.deep.equal(initialState);
    });
  });

  describe('setLocale', function () {
    before(function () {
      newState = fakeDispatch(setLocale('es'));
    });

    it('should set the locale', function () {
      expect(newState.locale).to.equal('es');
    });

    it('should set the counterpart locale', function () {
      expect(counterpart.setLocale).to.have.been.calledOnce;
      expect(counterpart.setLocale).to.have.been.calledWith('es');
    });

    it('should not set the rtl flag for ltr languages', function () {
      expect(newState.rtl).to.be.false;
    });

    it('should set the rtl flag for rtl languages', function () {
      newState = fakeDispatch(setLocale('he'));
      expect(newState.rtl).to.be.true;
    });

    it('should not change state', function () {
      expect(state).to.deep.equal(initialState);
    });
  });
});
