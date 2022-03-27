import TurndownService from 'turndown';

export const MAX_WIDTH = 1400
export const MAX_HEIGHT = 2000

function parseCanvasImage(image) {
  const { resource } = image;
  const id = resource.service['@id'];
  const src = `${id}/full/!${MAX_WIDTH},${MAX_HEIGHT}/0/default.jpg`;
  return { 'image/jpeg': src };
}

function parseCanvas(canvas, index) {
  const locations = canvas.images.map(parseCanvasImage);
  const thumbId = canvas.images[0].resource.service['@id'];
  const thumb = `${thumbId}/full/!400,400/0/default.jpg`;
  const metadata = {
    "iiif:canvas": canvas['@id'],
    priority: index + 1
  };
  return { thumb, locations, metadata };
}

export default function parseManifestV2(manifest) {
  const turndownService = new TurndownService();
  const { sequences, structures } = manifest;
  const [sequence] = sequences;
  const subjects = sequence.canvases.map((canvas, index) => {
    const alt = structures?.[index].label;
    const { thumb, locations, metadata } = parseCanvas(canvas, index);
    return { alt, locations, metadata, thumb };
  });
  const metadata = {
    "iiif:manifest": manifest['@id']
  };
  manifest.metadata.forEach(({ label, value }) => {
    metadata[label] = turndownService.turndown(value);
  });
  const thumb = subjects[0].thumb;
  const label = subjects[0].alt;
  return { label, metadata, subjects, thumb };
}
