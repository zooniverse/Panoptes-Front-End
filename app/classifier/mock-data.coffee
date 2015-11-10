apiClient = require '../api/client'

# This is just a blank image for testing drawing tools.
BLANK_IMAGE = ['data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAoAAAAHgAQMAAAA',
  'PH06nAAAABlBMVEXMzMyWlpYU2uzLAAAAPUlEQVR4nO3BAQ0AAADCoPdPbQ43oAAAAAAAAAAAAA',
  'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgzwCX4AAB9Dl2RwAAAABJRU5ErkJggg=='].join ''

MISC_DETAILS = [{
  type: 'single'
  required: true
  question: 'Cool?'
  answers: [
    {label: 'Yeah'}
    {label: 'Nah'}
  ]
}, {
  type: 'multiple'
  question: 'Cool stuff?'
  answers: [
    {label: 'Ice'}
    {label: 'Snow'}
  ]
}]

workflow = apiClient.type('workflows').create
  id: 'MOCK_WORKFLOW_FOR_CLASSIFIER'

  first_task: 'cool'
  tasks:

    cool:
      type: 'single'
      question: 'Is there anything here?'
      answers: [
        {label: 'Yeah', next: 'transcribe'}
        {label: 'Nah', next: null}
      ]

    transcribe:
      type: 'text'
      required: true
      question: 'Please describe what you see.'
      next: null

    draw:
      type: 'drawing'
      required: true
      instruction: 'Draw something.'
      help: '''
        Do this:
        * Pick a tool
        * Draw something
      '''
      tools: [
        {type: 'point', label: 'Point', color: 'red', details: MISC_DETAILS}
        {type: 'line', label: 'Line', color: 'yellow', details: MISC_DETAILS}
        {type: 'rectangle', label: 'Rectangle', color: 'lime', details: MISC_DETAILS}
        {type: 'polygon', label: 'Polygon', color: 'cyan', details: MISC_DETAILS}
        {type: 'circle', label: 'Circle', color: 'blue', details: MISC_DETAILS}
        {type: 'ellipse', label: 'Ellipse', color: 'magenta', details: MISC_DETAILS}
      ]
      next: 'cool'

subject = apiClient.type('subjects').create
  id: 'MOCK_SUBJECT_FOR_CLASSIFIER'

  locations: [
    {'image/jpeg': if navigator?.onLine then 'http://lorempixel.com/320/240/animals/1' else BLANK_IMAGE}
    {'image/jpeg': if navigator?.onLine then 'http://lorempixel.com/320/240/animals/2' else BLANK_IMAGE}
    {'image/jpeg': if navigator?.onLine then 'http://lorempixel.com/320/240/animals/3' else BLANK_IMAGE}
  ]

  metadata:
    'Capture date': '5 Feb, 2015'
    'Region': 'Chicago, IL'

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

classification = apiClient.type('classifications').create
  annotations: []
  metadata: {}
  links:
    project: 'NO_PROJECT'
    workflow: workflow.id
    subjects: [subject.id]
  _workflow: workflow # TEMP
  _subjects: [subject] # TEMP

module.exports = {workflow, subject, classification}
window?.mockClassifierData = module.exports
