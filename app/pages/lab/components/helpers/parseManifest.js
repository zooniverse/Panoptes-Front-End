function parseCanvasImage(image) {
  const { resource } = image;
  const id = resource.service[`@id`]
  const src = `${id}/full/!1400,2000/0/default.jpg`
  return { 'image/jpeg': src }
}

function parseCanvas(canvas, index) {
  const locations = canvas.images.map(parseCanvasImage)
  const id = canvas.images[0].resource.service['@id'];
  const thumb = `${id}/full/!400,400/0/default.jpg`
  const metadata = {
    priority: index + 1
  }
  return { id, thumb, locations, metadata }
}

export default function parseManifest(manifest) {
  const { sequences, structures } = manifest;
  const [sequence] = sequences;
  const subjects = sequence.canvases.map((canvas, index) => {
    const alt = structures?.[index].label;
    const { id, thumb, locations, metadata } = parseCanvas(canvas, index)
    return { id, alt, locations, metadata, thumb };
  });
  const metadata = {};
  manifest.metadata.forEach(({ label, value }) => {
    metadata[label] = value;
  });
  const thumb = subjects[0].thumb;
  const label = subjects[0].alt
  return { label, metadata, subjects, thumb };
}
