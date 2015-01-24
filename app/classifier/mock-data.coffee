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
      tools: [
        {type: 'point', value: 'point', label: 'Point', color: 'red'}
        {type: 'line', value: 'line', label: 'Line', color: 'red'}
        {type: 'rectangle', value: 'rectangle', label: 'Rectangle', color: 'red'}
        {type: 'polygon', value: 'polygon', label: 'Polygon', color: 'red'}
        {type: 'ellipse', value: 'ellipse', label: 'Ellipse', color: 'red'}
      ]
      next: 'cool'

    cool:
      type: 'single'
      question: 'Is this cool?'
      answers: [
        {value: true, label: 'Yeah'}
        {value: false, label: 'Nah'}
      ]

subject = apiClient.type('subjects').create
  locations: [
    {'image/jpg': 'http://lorempixel.com/100/100/animals/'}
    {'image/png': BLANK_IMAGE}
    {'image/png': BLANK_IMAGE}
  ]

classification = apiClient.type('classifications').create {}

module.exports = {workflow, subject, classification}
