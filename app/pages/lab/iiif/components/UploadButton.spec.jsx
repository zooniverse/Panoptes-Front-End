import apiClient from 'panoptes-client/lib/api-client';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';

import { UploadButton } from '.';
import { parseManifestV2 } from './helpers';
import manifest from './helpers/mockManifest.json';

describe('IIIF > UploadButton', function () {
  let wrapper;
  const { metadata, subjects } = parseManifestV2(manifest);
  const project = { id: 'testProject' };

  beforeEach(function () {
    wrapper = mount(<UploadButton manifest={manifest} metadata={metadata} project={project} subjects={subjects} />);
  })

  it('should contain an upload button', function () {
    const button = wrapper.find('button');
    expect(button.text()).to.equal('Create a subject set');
  })

  describe('on click', function () {
    let subjectSet
    let uploadedSubjects;

    before(function () {
      let count = 0;
      sinon.stub(apiClient, 'type').callsFake(type => {
        return {
          create: sinon.stub().callsFake(function (snapshot) {
            count++;
            const mockResource = {
              ...snapshot,
              id: count,
              addLink: sinon.stub().callsFake((key, value) => mockResource.links[key] = value),
              save: sinon.stub()
            };
            if (type === 'subject_sets') {
              subjectSet = mockResource
            }
            if (type === 'subjects') {
              uploadedSubjects.push(mockResource);
            }
            mockResource.save.resolves(mockResource);
            return mockResource;
          })
        }
      });
    })

    after(function () {
      apiClient.type.restore()
    })

    it('should create a subject set', function (done) {
      uploadedSubjects = [];
      wrapper.setProps({ onLoad: () => {
        wrapper.update();
        expect(subjectSet.display_name).to.equal(manifest.label);
        expect(subjectSet.metadata).to.deep.equal(metadata);
        expect(subjectSet.links.project).to.equal(project.id);
        expect(subjectSet.links.subjects).to.deep.equal(uploadedSubjects.map(subject => subject.id));
        done();
      }});
      const button = wrapper.find('button');
      button.simulate('click');
    })

    it('should upload subjects', function (done) {
      uploadedSubjects = [];
      wrapper.setProps({ onLoad: () => {
        wrapper.update();
        const message = wrapper.find('p');
        const link = wrapper.find('a');
        expect(uploadedSubjects.length).to.equal(subjects.length);
        expect(message.text()).to.equal('Uploading 360/360 subjects.');
        expect(link.text()).to.equal(subjectSet.display_name);
        done();
      }});
      const button = wrapper.find('button');
      button.simulate('click');
    })
  })
})