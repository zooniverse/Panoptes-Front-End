apiClient = require '../api/client'

# This is just a blank image for testing drawing tools while offline.
BLANK_IMAGE = ['data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAoAAAAHgAQMAAAA',
  'PH06nAAAABlBMVEXMzMyWlpYU2uzLAAAAPUlEQVR4nO3BAQ0AAADCoPdPbQ43oAAAAAAAAAAAAA',
  'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgzwCX4AAB9Dl2RwAAAABJRU5ErkJggg=='].join ''

MISC_DRAWING_DETAILS = [{
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
  instruction: 'Any additional comments?'
}]

workflow = apiClient.type('workflows').create
  id: 'MOCK_WORKFLOW_FOR_CLASSIFIER'

  first_task: 'init'

  tasks:
    init:
      type: 'single'
      question: 'Where shall we start?'
      answers: [
        {label: 'Crop the image', next: 'crop'}
        {label: 'Enter some text', next: 'write'}
        {label: 'Multi-answer question', next: 'features'}
        {label: 'Draw stuff', next: 'draw'}
        {label: 'Survey the image', next: 'survey'}
        {label: 'We’re done here.', next: null}
      ]

    crop:
      type: 'crop'
      instruction: 'Drag out a box around the face.'
      help: 'The face is the thing with the nose.'
      next: 'write'

    write:
      type: 'text'
      required: true
      instruction: 'Please describe what you see.'
      help: '''
        **Example**: If you see a bee, then type "Bee"
      '''
      next: 'features'

    features:
      type: 'multiple'
      question: 'What **cool** features are present?'
      answers: [
        {label: 'Cold water'}
        {label: 'Snow'}
        {label: 'Ice'}
        {label: 'Sunglasses'}
      ]
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
        {type: 'point', label: 'Point', color: 'red', details: MISC_DRAWING_DETAILS}
        {type: 'line', label: 'Line', color: 'yellow', details: MISC_DRAWING_DETAILS}
        {type: 'rectangle', label: 'Rectangle', color: 'lime', details: MISC_DRAWING_DETAILS}
        {type: 'polygon', label: 'Polygon', color: 'cyan', details: MISC_DRAWING_DETAILS}
        {type: 'circle', label: 'Circle', color: 'blue', details: MISC_DRAWING_DETAILS}
        {type: 'ellipse', label: 'Ellipse', color: 'magenta', details: MISC_DRAWING_DETAILS}
      ]
      next: 'survey'

    survey:
      type: 'survey'
      images:
        aa1: '//placehold.it/64.png?text=AA1'
        aa2: '//placehold.it/64.png?text=AA2'
        ar1: '//placehold.it/64.png?text=AR1'
        ar2: '//placehold.it/64.png?text=AR2'
        to1: '//placehold.it/64.png?text=TO1'
        to2: '//placehold.it/64.png?text=TO2'
        so: '//placehold.it/48.png?text=so'
        sp: '//placehold.it/48.png?text=sp'
        st: '//placehold.it/48.png?text=st'
        ba: '//placehold.it/48.png?text=ba'
        wh: '//placehold.it/48.png?text=wh'
        ta: '//placehold.it/48.png?text=ta'
        re: '//placehold.it/48.png?text=re'
        br: '//placehold.it/48.png?text=br'
        bl: '//placehold.it/48.png?text=bl'
        gr: '//placehold.it/48.png?text=gr'
      characteristicsOrder: ['pa', 'co']
      characteristics:
        pa:
          label: 'Pattern'
          valuesOrder: ['so', 'sp', 'st', 'ba']
          values:
            so:
              label: 'Solid'
              image: 'so'
            sp:
              label: 'Spots'
              image: 'sp'
            st:
              label: 'Stripes'
              image: 'st'
            ba:
              label: 'Bands'
              image: 'ba'
        co:
          label: 'Color'
          valuesOrder: ['wh', 'ta', 're', 'br', 'bl', 'gr']
          values:
            wh:
              label: 'White'
              image: 'wh'
            ta:
              label: 'Tan'
              image: 'ta'
            re:
              label: 'Red'
              image: 're'
            br:
              label: 'Brown'
              image: 'br'
            bl:
              label: 'Black'
              image: 'bl'
            gr:
              label: 'Green'
              image: 'gr'

      choicesOrder: ['aa', 'ar', 'to']
      choices:
        aa:
          label: 'Aardvark'
          description: 'Basically a long-nose rabbit'
          images: [
            'aa1'
            'aa2'
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
            'ar1'
            'ar2'
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
            'to1'
            'to2'
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
      next: 'init'

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
      task: 'init',
      value: 0
    }, {
      task: 'crop',
      value: {
        x: 10,
        y: 10,
        width: 300,
        height: 222
      }
    }, {
      task: 'write',
      value: 'Rhinos'
    }, {
      task: 'features',
      value: [0, 2]
    }, {
      task: 'draw',
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
      task: 'survey',
      value: []
    }, {
      task: 'init',
      value: 5
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
