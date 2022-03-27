import { expect } from 'chai';
import TurndownService from 'turndown';

import parseManifestV2, { MAX_WIDTH, MAX_HEIGHT } from './parseManifestV2';
import manifest from './mockManifest.json'

describe('parseManifestV2', function () {
  let data;
  const [sequence] = manifest.sequences;
  const turndownService = new TurndownService();

  before(function () {
    data = parseManifestV2(manifest);
  })

  it('should record the manifest identifier', function () {
      expect(data.metadata['iiif:manifest']).to.equal(manifest['@id']);
  })

  it('should convert manifest metadata to Markdown', function () {
    manifest.metadata.forEach(({ label, value }) => {
      const markdownValue = turndownService.turndown(value);
      expect(data.metadata[label]).to.equal(markdownValue);
    })
  })

  it('should generate subjects from the default sequence', function () {
    expect(data.subjects.length).to.equal(sequence.canvases.length)
  })

  it('should assign a priority to each subject', function () {
    sequence.canvases.forEach((canvas, index) => {
      const subject = data.subjects[index];
      expect(subject.metadata.priority).to.equal(index + 1);
    })
  })

  it('should assign locations to each subject from the canvas images', function () {
    sequence.canvases.forEach((canvas, index) => {
      const subject = data.subjects[index];
      expect(subject.locations.length).to.equal(canvas.images.length);
      canvas.images.forEach((image, imageIndex) => {
        const { resource } = image;
        const id = resource.service['@id'];
        const src = `${id}/full/!${MAX_WIDTH},${MAX_HEIGHT}/0/default.jpg`;
        const location = subject.locations[imageIndex];
        expect(location['image/jpeg']).to.equal(src);
      })
    })
  })

  it('should assign canvas identifiers to each subject', function () {
    sequence.canvases.forEach((canvas, index) => {
      const subject = data.subjects[index];
      expect(subject.metadata['iiif:canvas']).to.equal(canvas['@id']);
    })
  })
})