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
}, {
  type: 'text'
  required: true
  instruction: 'Any additional comments?'
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
      instruction: 'Please describe what you see.'
      help: '''
        **Example**: If you see a bee, then type "Bee"
      '''

      next: 'draw'
    draw:
      type: 'drawing'
      required: true
      instruction: 'Drop points on the rhino eyeballs.'
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

    crop:
      type: 'crop'
      instruction: 'Drag out a box around the face.'
      help: 'The face is the thing with the nose.'
      next: 'survey'

    survey:
      type: 'survey'
      required: true
      characteristicsOrder: ['pa', 'co']
      characteristics:
        pa:
          label: 'Pattern'
          valuesOrder: ['so', 'sp', 'st', 'ba']
          values:
            so:
              label: 'Solid'
              image: '//placehold.it/64.png?text=Solid'
            sp:
              label: 'Spots'
              image: '//placehold.it/64.png?text=Spots'
            st:
              label: 'Stripes'
              image: '//placehold.it/64.png?text=Stripes'
            ba:
              label: 'Bands'
              image: '//placehold.it/64.png?text=Bands'
        co:
          label: 'Color'
          valuesOrder: ['wh', 'ta', 're', 'br', 'bl', 'gr']
          values:
            wh:
              label: 'White'
              image: '//placehold.it/64.png?text=White'
            ta:
              label: 'Tan'
              image: '//placehold.it/64.png?text=Tan'
            re:
              label: 'Red'
              image: '//placehold.it/64.png?text=Red'
            br:
              label: 'Brown'
              image: '//placehold.it/64.png?text=Brown'
            bl:
              label: 'Black'
              image: '//placehold.it/64.png?text=Black'
            gr:
              label: 'Green'
              image: '//placehold.it/64.png?text=Green'

      choicesOrder: ['aa', 'ar', 'to']
      choices:
        aa:
          label: 'Aardvark'
          description: 'Basically a long-nose rabbit'
          images: [
            '//placehold.it/320x240.png?text=Aardvark 1'
            '//placehold.it/320x240.png?text=Aardvark 2'
          ]
          characteristics:
            pa: ['so']
            co: ['ta', 'br']
          confusionsOrder: ['ar']
          confusions:
            ar: 'They both start with “A”, so _some_ **dummies** get these two mixed up.'

        ar:
          label: 'Armadillo'
          description: 'A little rolly dude'
          images: [
            '//placehold.it/320x240.png?text=Armadillo 1'
            '//placehold.it/320x240.png?text=Armadillo 2'
          ]
          characteristics:
            pa: ['so', 'st']
            co: ['ta', 'br']
          confusionsOrder: []
          confusions: {}

        to:
          label: 'Tortoise'
          description: 'Little green house with legs'
          images: [
            '//placehold.it/320x240.png?text=Tortoise 1'
            '//placehold.it/320x240.png?text=Tortoise 2'
          ]
          characteristics:
            pa: ['so']
            co: ['gr']
          confusionsOrder: []
          confusions: {}

      questionsOrder: ['ho', 'be', 'in', 'hr']
      questions:
        ho:
          required: true
          multiple: false
          label: 'How many?'
          answersOrder: ['one', 'two', 'many']
          answers:
            one:
              label: '1'
            two:
              label: '2'
            many:
              label: '3+'
        be:
          required: true
          multiple: true
          label: 'Any activity?'
          answersOrder: ['mo', 'ea', 'in']
          answers:
            mo:
              label: 'Moving'
            ea:
              label: 'Eating'
            in:
              label: 'Interacting'
        in:
          required: false
          label: 'Any injuries?'
          answersOrder: ['y', 'n']
          answers:
            y:
              label: 'Yep'
            n:
              label: 'Nope'
        hr:
          required: false
          multiple: true
          label: 'Horns toggle'
          answersOrder: ['y']
          answers:
            y:
              label: 'Present'

      images: {}
      # next: 'draw'

      next: 'draw'

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
        x: 207
        y: 134
        frame: 0
      }, {
        tool: 0
        x: 295
        y: 97
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
