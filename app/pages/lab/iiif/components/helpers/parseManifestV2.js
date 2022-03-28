import TurndownService from 'turndown';

export const MAX_WIDTH = 1400
export const MAX_HEIGHT = 2000

const turndownService = new TurndownService();

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

function parseValue({ label, value }) {
  if (value[`@language`]) {
    const language = value[`@language`];
    label = `${label}:${language}`;
  }

  if (value[`@value`]) {
    value = value['@value'];
  }

  return {
    label,
    value: turndownService.turndown(value.toString())
  };
}

function parseMetadataItem({ label, value }) {
  if (Array.isArray(value)) {
    return value.map(v => parseValue({ label, value: v }));
  }

  return [
    parseValue({ label, value })
  ];
}

function parseMetadata(manifest) {
  const metadata = {};
  manifest.metadata.forEach(({ label, value }) => {
    const items = parseMetadataItem({ label, value });
    items.forEach(({ label, value }) => {
      metadata[label] = value;
    })
  });
  return metadata;
}

export default function parseManifestV2(manifest) {
  const { sequences, structures } = manifest;
  const [sequence] = sequences;
  const subjects = sequence.canvases.map((canvas, index) => {
    const alt = structures?.[index].label;
    const { thumb, locations, metadata } = parseCanvas(canvas, index);
    return { alt, locations, metadata, thumb };
  });
  const metadata = {
    "iiif:manifest": manifest['@id'],
    ...parseMetadata(manifest)
  };
  const thumb = subjects[0]?.thumb;
  const label = subjects[0]?.alt;
  return { label, metadata, subjects, thumb };
}
