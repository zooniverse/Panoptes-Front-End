export const SLUGS = [
  'nora-dot-eisner/planet-hunters-tess',
  'adamamiller/zwickys-stellar-sleuths',
  'msalmon/hms-nhs-the-nautical-health-service',
  'blicksam/transcription-task-testing',
  'humphrydavy/davy-notebooks-project',
  'mainehistory/beyond-borders-transcribing-historic-maine-land-documents',
  'zookeeper/galaxy-zoo-weird-and-wonderful',
  'hughdickinson/superwasp-black-hole-hunters',
  'bogden/scarlets-and-blues',
  'kmc35/peoples-contest-digital-archive',
  'rachaelsking/corresponding-with-quakers',
  'mariaedgeworthletters/maria-edgeworth-letters',
  'pmlogan/poets-and-lovers'
];

export function usesMonorepo(slug) {
  return SLUGS.includes(slug);
}

export function monorepoURL(slug) {
  if (window.location.hostname === 'www.zooniverse.org') {
    return `https://www.zooniverse.org/projects/${slug}`;
  }
  return `https://frontend.preview.zooniverse.org/projects/${slug}`;
}
