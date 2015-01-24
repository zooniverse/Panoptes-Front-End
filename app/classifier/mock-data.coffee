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
    {'image/jpg': 'http://lorempixel.com/100/100/animals/'}
    {'image/png': BLANK_IMAGE}
    {'image/png': BLANK_IMAGE}
  ]
  expert_classification_data:
    annotations: [{
      task: 'draw'
      marks: [{
        tool: 'point'
        x: 50
        y: 50
        frame: 0
      }]
    }, {
      task: 'cool'
      answer: 0
    }, {
      task: 'features'
      answers: [0, 2]
    }]

classification = apiClient.type('classifications').create {}

module.exports = {workflow, subject, classification}
window.mockData = module.exports
