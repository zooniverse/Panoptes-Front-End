/*
These utilities are used to determine if a Zooniverse project should be using
the FEM (Front-End-Monorepo) Classifier + project page.

Context: this code was created during the 2020/2021 transitory period where
we're migrating _some_ (but not _all_ ) projects to use FEM.

Please see the related /app/pages/lab-fem folder, which use separate checks
to see if the project should use the **FEM-compatible Project Builder.**
 */

export const SLUGS = [
  'nora-dot-eisner/planet-hunters-tess',
  'adamamiller/zwickys-stellar-sleuths',
  'msalmon/hms-nhs-the-nautical-health-service',
  'blicksam/transcription-task-testing',
  'humphrydavy/davy-notebooks-project',
  'mainehistory/beyond-borders-transcribing-historic-maine-land-documents',
  'zookeeper/galaxy-zoo-weird-and-wonderful',
  'zookeeper/planet-hunters-tessting',
  'cobalt-lensing/black-hole-hunters',
  'bogden/scarlets-and-blues',
  'kmc35/peoples-contest-digital-archive',
  'rachaelsking/corresponding-with-quakers',
  'mariaedgeworthletters/maria-edgeworth-letters',
  'pmlogan/poets-and-lovers',
  'emhaston/the-rbge-herbarium-exploring-gesneriaceae-the-african-violet-family',
  'printmigrationnetwork/print',
  'profdrrogerlouismartinez-davila/deciphering-secrets-unlocking-the-manuscripts-of-medieval-spain',
  'skirmizi/ottoman-turkish-crowdsourcing',
  'bldigital/in-the-spotlight',
  'md68135/notes-from-nature-labs',
  'fulsdavid/the-daily-minor-planet',
  'blicksam/human-machine-collaborative-transcription',
  'zooniverse/gravity-spy',
  'communitiesandcrowds/how-did-we-get-here',
  'zooniverse/snapshot-serengeti',
  'aeuk/elephant-id',
  'sophiemu/solar-jet-hunter',
  'elliereed185/knitting-leaflet-project',
  'dschopper/the-abcs-of-dialect',
  'willcharlie/etch-a-cell-correct-a-cell',
  'hughdickinson/galaxy-zoo-clump-scout-ii',
  'zookeeper/elephant-id-ey',
  'johandmi/arctic-archives-unraveling-greenlands-weather-history',
  'bmtcollections/documentation-detectives-transcribing-accession-registers',
  'bluejackets/civil-war-bluejackets',
  'leinwc/island-critter-cam',
  'abbsta/south-coast-threatened-fauna-recovery-project',
  'forestis/cedar-creek-eyes-on-the-wild',
  'zooniverse/chicago-wildlife-watch',
  'elwest/woodpecker-cavity-cam',
  'victorav/the-koster-seafloor-observatory',
  'victorav/spyfish-aotearoa',
  'bcosentino/squirrelmapper',
  'embeller/offal-wildlife-watching',
  'safmcadmin/fishstory',
  'bethzc/newark-digital-archive',
  'chloezycheng/science-scribbler-synapse-safari',
  'md68135/notes-from-nature-cas-plants-to-pixels',
  'juliehgibb/stereovision',
  'alexfitzpatrick/bradfords-industrial-heritage-in-photographs',
  'talkietoaster/void-orchestra',
  'hjsmith/the-material-culture-of-wills-england-1540-1790',
  'effeli/node-code-breakers-looking-for-patterns-in-lymph-nodes',
  'md68135/notes-from-nature-ranges-mammal-traits-from-western-north-america',
  'cmcbrain/axonal-pathfinders',
  'met-rhonda/irish-weather-rescue',
  'pmason/woodpecker-cavity-cam-learning',
  'tkillestein/kilonova-seekers',
  'tharinduj/citizen-asas-sn',
  'erinmc/dark-energy-explorers',
  'exoasteroids/exoasteroids',
  'ryanhepburn/finvision',
  'zooniverse/wildcam-gorongosa',
  'shuebner729/snapshot-lec',
  'meredithspalmer/snapshot-somkhanda',
  'shuebner729/snapshot-blouberg',
  'shuebner729/snapshot-venetia',
  'shuebner729/snapshot-golden-gate-highlands',
  'shuebner729/snapshot-tswalu',
  'shuebner729/snapshot-molopo',
  'shuebner729/snapshot-elephants-for-africa',
  'shuebner729/snapshot-de-hoop',
  'shuebner729/snapshot-kgalagadi',
  'shuebner729/snapshot-camdeboo',
  'shuebner729/snapshot-madikwe',
  'aguthmann/snapshot-enonkishu',
  'meredithspalmer/snapshot-debshan',
  'shuebner729/snapshot-kruger',
  'meredithspalmer/snapshot-mountain-zebra',
  'shuebner729/snapshot-pilanesberg',
  'shuebner729/snapshot-karoo',
  'meredithspalmer/snapshot-grumeti',
  'meredithspalmer/snapshot-gondwana',
  'shuebner729/snapshot-apnr',
  'meredithspalmer/snapshot-mariri',
  'meredithspalmer/snapshot-ruaha',
  'crea-mont-blanc/wild-mont-blanc',
  'rowan-aspire/the-wild-southwest',
  'sharkspy/shark-spy',
  'jordan-pierce/click-a-coral',
  'sandiegozooglobal/wildwatch-burrowing-owl',
  'mschwamb/planet-hunters-ngts',
  'orionnau/active-asteroids'
];

export function usesMonorepo(slug) {
  if (window.location.hostname === 'frontend.preview.zooniverse.org') {
    return true;
  }
  return SLUGS.includes(slug);
}

export function monorepoURL(slug) {
  if (window.location.hostname === 'www.zooniverse.org') {
    return `https://www.zooniverse.org/projects/${slug}`;
  }
  return `https://frontend.preview.zooniverse.org/projects/${slug}`;
}
