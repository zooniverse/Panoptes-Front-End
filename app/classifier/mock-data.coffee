apiClient = require '../api/client'

# This is just a blank image for testing drawing tools.
BLANK_IMAGE = ['data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAoAAAAHgAQMAAAA',
  'PH06nAAAABlBMVEXMzMyWlpYU2uzLAAAAPUlEQVR4nO3BAQ0AAADCoPdPbQ43oAAAAAAAAAAAAA',
  'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgzwCX4AAB9Dl2RwAAAABJRU5ErkJggg=='].join ''

workflow = apiClient.type('workflows').create
  first_task: 'draw'
  tasks:
    draw:
      type: 'drawing'
      instruction: 'Draw something.'
      tools: [
        {type: 'point', label: 'Point', color: 'red'}
        {type: 'line', label: 'Line', color: 'red'}
        {type: 'rectangle', label: 'Rectangle', color: 'red'}
        {type: 'polygon', label: 'Polygon', color: 'red'}
        {type: 'circle', label: 'Circle', color: 'red'}
        {type: 'ellipse', label: 'Ellipse', color: 'red'}
      ]
      next: 'cool'

    cool:
      type: 'single'
      question: 'Is this cool?'
      answers: [
        {label: 'Yeah'}
        {label: 'Nah'}
      ]
      next: 'features'

    features:
      type: 'multiple'
      question: 'What cool features are present?'
      answers: [
        {label: 'Cold water'}
        {label: 'Snow'}
        {label: 'Ice'}
        {label: 'Sunglasses'}
      ]

subject = apiClient.type('subjects').create
  locations: [
    {'image/jpeg': 'http://lorempixel.com/400/300/animals/1'}
    {'image/jpeg': 'http://lorempixel.com/400/300/animals/2'}
    {'image/jpeg': 'http://lorempixel.com/400/300/animals/3'}
  ]
  expert_classification_data:
    annotations: [{
      task: 'draw'
      value: [{
        tool: 0
        x: 50
        y: 50
        frame: 0
      }, {
        tool: 0
        x: 150
        y: 50
        frame: 0
      }]
    }, {
      task: 'cool'
      value: 0
    }, {
      task: 'features'
      value: [0, 2]
    }]

classification = apiClient.type('classifications').create {}
classification.annotate workflow.tasks[workflow.first_task].type, workflow.first_task

module.exports = {workflow, subject, classification}
window.mockData = module.exports
