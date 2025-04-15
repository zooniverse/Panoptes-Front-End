# VolumetricViewer in Talk

NOTE: This is a copy on 2025-04-15 of the FEM lib-subject-viewers VolumetricViewer component. There are a several important modifications that were made:
- Removal of asyncstates initial state because we are using React.lazy() + <Suspense />
- Removal of React18 (or other upgrades) from where PFE currently is
- Removal of annotation capabilities and related visual elements
- Removal of all unnecessary files (tests, mock data, components, etc)
- Changing of styles to fit Talk context