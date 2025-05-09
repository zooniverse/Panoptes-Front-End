# VolumetricViewer in Talk

NOTE: This is a copy on 2025-04-15 of the FEM lib-subject-viewers VolumetricViewer component. There are a several important modifications that were made:
- Removal of all dependencies (Three, Grommet, etc) except Buffer
- Removal of React18 (or other upgrades) from where PFE currently is
- Removal of annotation capabilities and related visual elements
- Removal of all unnecessary files (tests, mock data, components, etc)
- Changing of styles to fit Talk context
- Inline Three.js v0.173.0 and strip out all unused classes/functions/variables/exports

## Elaboration on Three.js Inline Process
The VolumetricViewer uses the Three.js library, but since the full library is bonkers huge and adds an unnecessary amount of bytes for volunteers to download, we've made local copy with _only_ the necessary functions to make the VolumetricViewer work.

If you ever need to update the Three.js library for whatever reason (and you really shouldn't), please do the following:
1. download the latest version of Three.js 
2. Pair down the exports to match the Three.js version in /VolumetricViewer/helpers
2. Snip out everything that's an unused variable, function, class, etc
3. Make a minified version
4. Replace /VolumetricViewer/helpers/Three.js and /VolumetricViewer/helpers/Three.min.js
5. Ensure the VolumetricViewer continues to work on an example project+subject: www.zooniverse.org/projects/kieftrav/volumetric-viewer/talk/subjects/252488?env=staging
