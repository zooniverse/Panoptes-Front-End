apiClient = require 'panoptes-client/lib/api-client'

# This is just a blank image for testing drawing tools while offline.
BLANK_IMAGE = ['data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAoAAAAHgAQMAAAA',
  'PH06nAAAABlBMVEXMzMyWlpYU2uzLAAAAPUlEQVR4nO3BAQ0AAADCoPdPbQ43oAAAAAAAAAAAAA',
  'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgzwCX4AAB9Dl2RwAAAABJRU5ErkJggg=='].join ''

MISC_DRAWING_DETAILS = [{
  type: 'single'
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

  configuration:
    multi_image_mode: 'flipbook_and_separate'

  first_task: 'init'

  tasks:
    init:
      type: 'single'
      question: 'Where shall we start?'
      help: 'You don’t need help with this.'
      answers: [
        {label: 'Everything all at once! :skull:', next: 'combo'}
        {label: 'Crop the image', next: 'crop'}
        {label: 'Enter some text', next: 'write'}
        {label: 'Single-answer question', next: 'ask'}
        {label: 'Multi-answer question', next: 'features'}
        {label: 'Draw stuff', next: 'draw'}
        {label: 'Survey the image', next: 'survey'}
        {label: 'Maybe select something', next: 'dropdown'}
        {label: 'We’re done here.', next: null}
      ]

    combo:
      type: 'combo'
      loosen_requirements: true
      tasks: [
        'crop'
        'write'
        'ask'
        'features'
        'draw'
        'survey'
      ]
      next: 'init'

    crop:
      type: 'crop'
      instruction: 'Drag out a box around the smaller rhino.'
      help: 'That’s the adorable one.'
      next: 'write'

    write:
      type: 'text'
      required: true
      instruction: 'What’s the name of this animal? Is it a rhino?'
      help: '''
        **Example**: If you see a bee, then type "Bee"
      '''
      next: 'ask'

    ask:
      type: 'single'
      question: 'Rhino starts with...'
      answers: [
        {label: 'Are', next: 'features'}
        {label: 'Aitch', next: 'features'}
        {label: 'Eye', next: 'features'}
        {label: 'En', next: 'features'}
        {label: 'Oh', next: 'features'}
      ]

    features:
      type: 'multiple'
      question: 'What **cool** features are present? The first two?'
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
      instruction: 'Drop a point on the rhino eyeball.'
      help: '''
        Do this:
        * Pick a tool
        * Draw something
      '''
      tools: [
        {type: 'point', label: 'Point', color: 'red', min: 1, max: 2}
        {type: 'line', label: 'Line', color: 'yellow', min: 0}
        {type: 'rectangle', label: 'Rectangle', color: 'lime', max: 2}
        {type: 'polygon', label: 'Polygon', color: 'cyan', details: MISC_DRAWING_DETAILS}
        {type: 'circle', label: 'Circle', color: 'blue', details: MISC_DRAWING_DETAILS}
        {type: 'ellipse', label: 'Ellipse '.repeat(25), color: 'magenta', details: MISC_DRAWING_DETAILS}
        {type: 'bezier', label: 'Bezier', color: 'orange', details: MISC_DRAWING_DETAILS}
      ]
      next: 'survey'

    survey:
      type: 'survey'
      images:
        aa1: '//placehold.it/64x32.png?text=AA1_WIDE'
        aa2: '//placehold.it/64.png?text=AA2'
        ar1: '//placehold.it/64x32.png?text=AR1_WIDE'
        ar2: '//placehold.it/64.png?text=AR2'
        to1: '//placehold.it/64x32.png?text=TO1_WIDE'
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

      questionsMap:
        ar: ['ho', 'be']
        to: ['ho', 'be', 'in', 'bt']
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
          label: 'Horns (toggle)'
          answersOrder: ['y']
          answers:
            y:
              label: 'Present'
        bt:
          required: true
          multiple: false
          label: 'Are tortoises awesome?'
          answersOrder: ['y','Y']
          answers:
            y:
              label: 'yes'
            Y:
              label: 'HECK YES'

      next: 'init'

    dropdown:
      next: 'write'
      type: 'dropdown'
      instruction: "Select something, or if it's not an option - write it!"
      selects: [
        {
          id: "cd1c7a8a13726"
          title: "Country"
          required: true
          options: {
            '*': [
              {value: "USA", label: "United States of America"},
              {value: "Canada", label: "Canada"},
              {value: "Mypos", label: "Mypos"}
            ]
          }
        },
        {
          id: "26971f135cb4b"
          title: "State/Province"
          required: true
          allowCreate: false
          condition: "cd1c7a8a13726"
          options: {
            'USA': [
              {value: "HI", label: "Hawaii"},
              {value: "IL", label: "Illinois"},
              {value: "WI", label: "Wisconsin"}
            ],
            'Canada': [
              {value: "AB", label: "Alberta"},
              {value: "ON", label: "Ontario"},
              {value: "QC", label: "Quebec"}
            ],
            'Mypos': [
              {value: "Gondor", label: "Gondor"},
              {value: "Rohan", label: "Rohan"},
              {value: "Shire", label: "Shire"}
            ]
          }
        },
        {
          id: "8f7afd193da42"
          title: "County"
          allowCreate: false
          condition: "26971f135cb4b"
          options: {
            'USA;HI': [
              {value: "Honolulu", label: "Honolulu"},
              {value: "Maui", label: "Maui"}
            ],
            'USA;IL': [
              {value: "Cook", label: "Cook"},
              {value: "Lake", label: "Lake"}
            ],
            'Canada;AB': [
              {value: "Rocky View", label: "Rocky View"},
              {value: "Parkland", label: "Parkland"}
            ],
            'Canada;QC': [
              {value: "Montreal", label: "Montreal"},
              {value: "Capitale-Nationale", label: "Capitale-Nationale"}
            ],
            'Mypos;Rohan': [
              {value: "Gotham County", label: "Gotham County"},
              {value: "Metropolis County", label: "Metropolis County"}
            ],
            'Mypos;Shire': [
              {value: "Municipality of Bikini Bottom", label: "Municipality of Bikini Bottom"},
              {value: "Elbonia", label: "Elbonia"}
            ]
          }
        },
        {
          id: "fdd12d9f1ad52"
          title: "City"
          allowCreate: false
          condition: "8f7afd193da42"
          options: {
            'USA;HI;Honolulu': [
              {value: "Honolulu", label: "Honolulu city"}
            ],
            'USA;IL;Cook': [
              {value: "Chicago", label: "Chicago"},
              {value: "Evanston", label: "Evanston"}
            ],
            'USA;IL;Lake': [
              {value: "Waukegan", label: "Waukegan"},
              {value: "Wheeling", label: "Wheeling"}
            ],
            'Canada;AB;Rocky View': [
              {value: "Airdrie", label: "Airdrie"},
              {value: "Chestermere", label: "Chestermere"}
            ],
            'Canada;QC;Capitale-Nationale': [
              {value: "Quebec City", label: "Quebec City"},
              {value: "Saint-Raymond", label: "Saint-Raymond"}
            ],
            'Mypos;Rohan;Gotham County': [
              {value: "Gotham", label: "Gotham"}
            ],
            'Mypos;Rohan;Metropolis County': [
              {value: "Metropolis", label: "Metropolis"}
            ],
            'Mypos;Shire;Municipality of Bikini Bottom': [
              {value: "Bikini Bottom", label: "Bikini Bottom"}
            ],
            'Mypos;Shire;Elbonia': [
              {value: "Townbert", label: "Townbert"}
            ]
          }
        },
        {
          id: "e45fdf113f07e"
          title: "Best State Sports Team"
          allowCreate: true
          condition: "26971f135cb4b"
          options: {
            'USA;HI': [
              {value: "59d8b49f6a0bc", label: "Sharks"},
              {value: "1df102313d355", label: "Rainbow Warriors"}
            ],
            'USA;IL': [
              {value: "b085abfe3c4d9", label: "Bears"},
              {value: "964419c0f3ade", label: "Bulls"},
              {value: "e4430cd2c0be", label: "Blackhawks"}
            ],
            'Canada;AB': [
              {value: "6df716c19bf73", label: "Oilers"},
              {value: "23843c7b8ca3a", label: "Flames"}
            ],
            'Canada;QC': [
              {value: "105ee8e45828c", label: "Canadiens"},
              {value: "ade89b3bed25c", label: "Expos"}
            ],
            'Mypos;Shire': [
              {value: "084f28a8999be", label: "Mighty Ducks"},
              {value: "b52ad46b3818e", label: "Little Giants"}
            ],
            'Mypos;Rohan': [
              {value: "df7cb03611f08", label: "Shelbyville Shelbyvillians"},
              {value: "fac0841caac4e", label: "Springfield Isotopes"}
            ]
          }
        }
      ]

# Bulk up the survey task a bit:
'abcdefghijlkmnopqrstuvwxyz1234'.split('').forEach (x, i) ->
  xi = x + i
  workflow.tasks.survey.choicesOrder.push xi
  workflow.tasks.survey.choices[xi] =
    label: xi
    description: xi
    images: [Object.keys(workflow.tasks.survey.images)[Math.floor Math.random() * Object.keys(workflow.tasks.survey.images).length]]
    characteristics: do ->
      out = {}
      workflow.tasks.survey.characteristicsOrder.forEach (charID) ->
        out[charID] = workflow.tasks.survey.characteristics[charID].valuesOrder.filter ->
          Math.random() < 0.5
      out
    confusionsOrder: []
    confusions: {}

subject = apiClient.type('subjects').create
  id: 'MOCK_SUBJECT_FOR_CLASSIFIER'

  locations: [
    {'image/jpeg': if navigator?.onLine then '//lorempixel.com/320/240/animals/1' else BLANK_IMAGE}
    {'image/jpeg': if navigator?.onLine then '//lorempixel.com/320/240/animals/2' else BLANK_IMAGE}
    {'image/jpeg': if navigator?.onLine then '//lorempixel.com/320/240/animals/3' else BLANK_IMAGE}
  ]

  metadata:
    'Capture date': '5 Feb, 2015'
    'Region': 'Chicago, IL'

  expert_classification_data:
    MOCK_WORKFLOW_FOR_CLASSIFIER: apiClient.type('classifications').create
      annotations: [{
        task: 'init'
        value: 0
      }, {
        task: 'crop'
        value: {
          x: 20
          y: 57
          width: 224
          height: 142
        }
      }, {
        task: 'write'
        value: 'Rhino'
      }, {
        task: 'ask'
        value: 0
      }, {
        task: 'features'
        value: [0, 1]
      }, {
        task: 'draw'
        value: [{
          tool: 0
          frame: 0
          x: 207
          y: 134
          details: [{
            value: 0
          }, {
            value: []
          }, {
            value: ''
          }]
        }]
      }, {
        task: 'survey'
        value: []
      }, {
        task: 'init'
        value: 6
      }]

project = apiClient.type('project').create
  id: 'MOCK_PROJECT_FOR_CLASSIFIER'
  title: "The Dev Classifier"
  experimental_tools: ['pan and zoom']

classification = apiClient.type('classifications').create
  annotations: []
  metadata: {}
  links:
    project: project.id
    workflow: workflow.id
    subjects: [subject.id]
  _workflow: workflow # TEMP
  _subjects: [subject] # TEMP


module.exports = {workflow, subject, classification, project}
window?.mockClassifierData = module.exports
