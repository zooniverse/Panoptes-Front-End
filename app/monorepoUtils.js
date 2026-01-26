/*
  These utilities are used to determine if a Zooniverse project should be using
  the FEM (Front-End-Monorepo) Classifier + project page.

  Context: this code was created during the 2020/2021 transitory period where
  we're migrating _some_ (but not _all_ ) projects to use FEM. As of 2025, the majority
  of approved Zooniverse projects were migrated to FEM's classifier. This code is now
  used to keep a list of projects that remain on PFE's classifier for the reasons
  listed below.

  Please see the related /app/pages/lab-fem folder, and slugList.js.
 */

import PFE_SLUGS from './slugList'

export function monorepoURL(slug) {
  if (window.location.hostname === 'www.zooniverse.org') {
    return `https://www.zooniverse.org/projects/${slug}`;
  }
  return `https://frontend.preview.zooniverse.org/projects/${slug}`;
}

export function usesPFEClassifier(slug) {
  return PFE_SLUGS.includes(slug)
}
