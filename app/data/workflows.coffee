Store = require './store'

EXAMPLE_WORKFLOW =
  id: 'GZ_MAIN_WORKFLOW'
  firstTask: 'interest'
  tasks:
    interest:
      type: 'drawing'
      question: 'Click your favorite point'
      tools: [
        {value: 'interesting', label: 'Best point', tool: 'point'}
      ]
      required: false
      next: 'shape'

    shape:
      type: 'multiple'
      question: 'What shape is this galaxy?'
      answers: [
        {value: 'smooth', label: 'Smooth'}
        {value: 'features', label: 'Features'}
        {value: 'other', label: 'Star or artifact'}
      ]
      next: 'roundness'

    roundness:
      type: 'single'
      question: 'How round is it?'
      answers: [
        {value: 'very', label: 'Very'}
        {value: 'sorta', label: 'In between'}
        {value: 'not', label: 'Cigar shaped'}
      ]
      next: null

module.exports = window.workflowStore = new Store
  root: '/workflows'
  examples: [EXAMPLE_WORKFLOW]
