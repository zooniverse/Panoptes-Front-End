/*
This file should provide a model to be rendered in model-canvas using regl
Model needs:
 - to be provided with the regl instance created in model-canvas
 - to have a method which accepts an annotation and returns a list of render
   functions and function argument, called as i[0](i[1])
 - render functions should be of the form f(regl) => regl(kwargs), so that they
   can be instantiated with the correct rendering regl

Proposed usage:
  To render to modelCanvas:
  const model = myModel(modelCanvas, baseImage);
  model.update(annotation) // update render functions from new annotation
  - this calls:
  - parse(annotation)
  - poll and clear regl
  - cycle through render functions calculated in parse()
  - call any post-processing saved as this.postProcessing
  - calcluate the difference between model and image
*/

// TODO: get rid of score, should be handled in model

import GalaxyBuilderModel from './galaxy-builder';
import LinePlotModel from './line-plot';
import TestModel from './test-model';
// TODO: this should be workflow.configuration.modelling.model, or even at the
//       subject-level (different models for each subject).
export default (subjectModellingInfo) => {
  switch (subjectModellingInfo.model) {
    case 'GALAXY_BUILDER_MODEL':
    case 'GALAXY_BUILDER_DIFFERENCE':
      return GalaxyBuilderModel;
    case 'LINE_PLOT':
      return LinePlotModel;
    case 'TEST_MODEL':
      return TestModel;
    default:
      return TestModel;
  }
};
