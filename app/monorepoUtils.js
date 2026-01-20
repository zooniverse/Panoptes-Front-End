/*
  These utilities are used to determine if a Zooniverse project should be using
  the FEM (Front-End-Monorepo) Classifier + project page.

  Context: this code was created during the 2020/2021 transitory period where
  we're migrating _some_ (but not _all_ ) projects to use FEM. As of 2025, the majority
  of approved Zooniverse projects were migrated to FEM's classifier. This code is now
  used to keep a list of projects that remain on PFE's classifier for the reasons
  listed below.

  Please see the related /app/pages/lab-fem folder, which use separate checks
  to see if the project should use the **FEM-compatible Project Builder.**
 */

/* This list is incomplete, it will be updated by Jan 27 */
export const PFE_SLUGS = [
  // Private projects
  'artem-dot-reshetnikov/saint-george-on-a-bike',
  'y-dot-liefting/snapshot-hoge-veluwe',
  'frankmuseum/civil-war-diary',
  'h-spiers/etch-a-cell-mito-mega-mix',
  'bmtcollections/documentation-detectives-birmingham-community',
  // Audio subjects aren't supported in FEM's classifier
  'laac-lscp/maturity-of-baby-sounds',
  'ollibruuh/frog-find',
  'ollibruuh/bird-find',
  // Audio subject with spectrogram isn't supported in FEM
  'marywestwood/the-cricket-wing',
  'hannah-dot-slesinski/chirp-check',
  'creisdorf/savanna-spy-sound',
  'yli/humbug',
  // SVG subjects aren't supported in FEM
  'gaia-zooniverse/gaia-vari',
  // Video in a flipbook isn't supported in FEM
  'sassydumbledore/chimp-and-see',
  'projectenigma/enigmatic-near-earth-visitors',
  // Oval drawing tool is a worse experience in FEM
  'low-sky/bubblezoo-v1',
  // Feedback per step isn't supported in FEM
  'rsengar/einstein-at-home-pulsar-seekers',
  // Dependent dropdowns aren't supported in FEM
  'md68135/notes-from-nature-terrestrial-parasite-tracker',
  'md68135/notes-from-nature-herbarium',
  'md68135/notes-from-nature-capturing-californias-flowers',
  'md68135/notes-from-nature-calbug',
  'md68135/notes-from-nature-flora-of-texas-and-oklahoma',
  // Subject image sizes make classification difficult in FEM's classifier layout
  'dwhiter/aurora-zoo',
  'msbrhonclif/science-scribbler-placenta-profiles',
  'msbrhonclif/science-scribbler-key2cat',
  'acre-ar/meteororum-ad-extremum-terrae',
  'aprajita/space-warps-des-vision-transformer',
  'tawakitom/penguins-from-above',
  // Issue with its combo task
  'hripsi-19/atmoselec-atmospheric-electricity-for-climate',
  'astorino/sovraimpressioni',
  // Uses experimental "slider" subtask
  'zookeeper/galaxy-zoo',
  'hugo-ferreira/where-is-spoony',
  // Uses experimental "shortcut"
  'penguintom79/penguin-watch',
  'penguintom79/seabirdwatch',
  // Freehand segment line and freehand shape deprecated from FEM
  'astro-lab-ncmns/spiral-graph',
  'xbonnin/solar-radio-burst-tracker',
  // Uses experimental "fan tool"
  'mschwamb/planet-four'
]

export function monorepoURL(slug) {
  if (window.location.hostname === 'www.zooniverse.org') {
    return `https://www.zooniverse.org/projects/${slug}`;
  }
  return `https://frontend.preview.zooniverse.org/projects/${slug}`;
}

export function usesPFEClassifier(slug) {
  return PFE_SLUGS.includes(slug)
}
