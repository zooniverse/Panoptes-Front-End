# NOTE: Store/dispatcher stuff is no longer used.
# Call methods on resources or collections directly.

Store = require './store'

EXAMPLE_WORKFLOW =
  id: 'GZ_MAIN_WORKFLOW'
  firstTask: 'interest'
  tasks:
    interest:
      type: 'drawing'
      question: 'Color some points'
      tools: [
        {value: 'red', label: 'Red', type: 'point', color: 'red'}
        {value: 'green', label: 'Green', type: 'point', color: 'lime'}
        {value: 'blue', label: 'Blue', type: 'point', color: 'blue'}
        {value: 'ellipse', label: 'Ellipse', type: 'ellipse', color: 'orangered'}
      ]
      next: 'shape'

    shape:
      type: 'multiple'
      question: 'What shape is this galaxy?'
      answers: [
        {value: 'smooth', label: 'Smooth'}
        {value: 'features', label: 'Features'}
        {value: 'other', label: 'Star or artifact'}
      ]
      required: true
      next: 'roundness'

    roundness:
      type: 'single'
      question: 'How round is it?'
      answers: [
        {value: 'very', label: 'Very...', next: 'shape'}
        {value: 'sorta', label: 'In between'}
        {value: 'not', label: 'Cigar shaped'}
      ]
      next: null

module.exports = window.workflowStore = new Store
  root: '/workflows'
  examples: [EXAMPLE_WORKFLOW]
