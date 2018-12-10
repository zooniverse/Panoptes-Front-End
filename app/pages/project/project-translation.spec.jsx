import React from 'react';
import assert from 'assert';
import { mount } from 'enzyme';
import { ProjectTranslations } from './project-translations';

function Stub() {
  return (
    <p> I do nothing.</p>
  );
}

const initialTranslations = {
  strings: {
    project: {}
  }
};

const translations = {
  strings: {
    project: {
      '12345': {
        translated_type: 'Project',
        translated_id: '12345',
        strings: {
          title: 'A translated title',
          display_name: 'A translated display name',
          introduction: 'A translated introduction'
        }
      }
    }
  }
};

const project = {
  id: '12345',
  title: 'Project title',
  display_name: 'Project display name',
  introduction: 'Project introduction',
  description: 'A project description',
  researcher_quote: 'Hello world!',
  links: {}
};

const expectedProject = {
  id: '12345',
  title: 'Project title',
  display_name: 'Project display name',
  introduction: 'Project introduction',
  description: 'A project description',
  researcher_quote: 'Hello world!',
  links: {}
};

const defaultTranslation = {
  title: 'Project title',
  display_name: 'Project display name',
  introduction: 'Project introduction',
  description: 'A project description',
  researcher_quote: 'Hello world!'
};

const projectTranslation = {
  title: 'A translated title',
  display_name: 'A translated display name',
  introduction: 'A translated introduction',
  description: 'A project description',
  researcher_quote: 'Hello world!'
};

describe('Project translation with a translation', function () {
  const wrapper = mount(
    <ProjectTranslations project={project} translations={translations}>
      <Stub project={project} />
    </ProjectTranslations>
  );
  const stub = wrapper.find(Stub);

  it('should not mutate the original project', function () {
    assert.deepEqual(stub.prop('project'), expectedProject);
  });

  it('should copy translation strings to the translation object', function () {
    assert.deepEqual(stub.prop('translation'), projectTranslation);
  });
});

describe('Project translation without a translation', function () {
  const wrapper = mount(
    <ProjectTranslations project={project} translations={initialTranslations}>
      <Stub project={project} />
    </ProjectTranslations>
  );
  const stub = wrapper.find(Stub);

  it('should not mutate the original project', function () {
    assert.deepEqual(stub.prop('project'), expectedProject);
  });

  it('should fall back to using the project strings', function () {
    assert.deepEqual(stub.prop('translation'), defaultTranslation);
  });
});
