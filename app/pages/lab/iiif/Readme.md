# IIIF manifests

Tools to create Panoptes subject sets from [IIIF](https://iiif.io) manifests, rather than CSV files.

At the moment (28th March 2022) we only support [version 2 manifests](https://iiif.io/api/presentation/2.0/#manifest) (in `iiif/components/helpers/parseManifestV2.js`). 

A manifest is represented in Panoptes as a single subject set. Each canvas in the manifest's default sequence (`manifest.sequences[0]`) is converted into a Panoptes subject with one image location. Manifest metadata is copied to the new subject set's metadata, and also to each subject, so that it can be displayed in the subject viewer.

Each subject is assigned a `#priority` metadata key, in manifest sequence order and starting at 1, so that ordered subject selection can be used with workflows that have `workflow.prioritized` set.

Subject images are externally hosted, using the [IIIF Image API](https://iiif.io/api/image/2.0/) service specified in the manifest for each canvas, eg.
```js
  import { MAX_WIDTH, MAX_HEIGHT } from `./parseManifestV2.js`;
  const href = `https://api.bl.uk/image/iiif/ark:/81055/vdc_100022589175.0x000028/full/!${MAX_WIDTH},${MAX_HEIGHT_}/0/default.jpg`;
``` 
