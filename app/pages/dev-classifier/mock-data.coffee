apiClient = require 'panoptes-client/lib/api-client'

# This is just a blank image for testing drawing tools while offline.
BLANK_IMAGE = ['data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAoAAAAHgAQMAAAA',
  'PH06nAAAABlBMVEXMzMyWlpYU2uzLAAAAPUlEQVR4nO3BAQ0AAADCoPdPbQ43oAAAAAAAAAAAAA',
  'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgzwCX4AAB9Dl2RwAAAABJRU5ErkJggg=='].join ''

DRAWING_DETAILS_REQUIRED = [
  {
    type: 'single'
    question: 'Cool?'
    answers: [
      {label: 'Yeah'}
      {label: 'Nah'}
    ],
    required: true
  }
]

MISC_DRAWING_DETAILS = [
  {
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
  }, {
    type: 'slider'
    instruction: 'Slide me'
    min: '0'
    max: '10'
    step: '0.5'
    defaultValue: '3'
  }
]

workflow = apiClient.type('workflows').create
  id: 'MOCK_WORKFLOW_FOR_CLASSIFIER'

  configuration:
    enable_subject_flags: true
    enable_switching_flipbook_and_separate: true
    multi_image_clone_markers: false
    multi_image_layout: 'grid3'
    invert_subject: true
    persist_annotations: false
    pan_and_zoom: true

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
        {label: 'Slide a slider', next: 'slider'}
        {label: 'Annotate text', next:'highlight'}
        {label: 'We’re done here.', next: null}
      ]
      unlinkedTask: 'shortcut'

    shortcut:
      type: 'shortcut'
      answers: [
        {label: "Nothing Here"}
      ]

    combo:
      type: 'combo'
      loosen_requirements: true
      tasks: [
        # 'crop'
        'write'
        'ask'
        'features'
        'draw'
        'survey'
        'slider'
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
        {type: 'pointGrid', label: 'Point Grid', color: 'red', rows: 10, cols: 10, offsetX: 50, offsetY: 50, opacity: 40}
        {type: 'point', label: 'Small Point', color: 'coral', size: 'small'}
        {type: 'line', label: 'Line', color: 'yellow', min: 0}
        {type: 'rectangle', label: 'Rectangle', color: 'lime', max: 2}
        {type: 'rotateRectangle', label: 'Rotate Rectangle', color: 'red'}
        {type: 'polygon', label: 'Polygon', color: 'cyan', details: MISC_DRAWING_DETAILS}
        {type: 'circle', label: 'Circle', color: 'blue', details: DRAWING_DETAILS_REQUIRED}
        {type: 'ellipse', label: 'Ellipse '.repeat(25), color: 'magenta', details: MISC_DRAWING_DETAILS}
        {type: 'anchoredEllipse', label: 'Anchored Ellipse', color: 'darkmagenta'}
        {type: 'triangle', label: 'Triangle', color: 'salmon'}
        {type: 'bezier', label: 'Bezier', color: 'orange', details: MISC_DRAWING_DETAILS}
        {type: 'column', label: 'Column Rectangle', color: 'darkgreen'}
        {type: 'grid', label: 'Grid', color: 'purple'}
        {type: 'freehandLine', label: 'Freehand Line', color: 'deepskyblue'}
        {type: 'freehandShape', label: 'Freehand Shape', color: 'darkseagreen'}
        {type: 'freehandSegmentLine', label: 'Freehand Segment Line', color: 'gold'}
        {type: 'freehandSegmentShape', label: 'Freehand Segment Shape', color: 'goldenrod'}
        {type: 'fullWidthLine', label: 'Full Width Line', color: 'orchid'}
        {type: 'fullHeightLine', label: 'Full Height Line', color: 'mediumvioletred'}
        {type: 'fan', label: 'Fan Tool', color: 'mediumvioletred'}
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
          label: 'Aardvark '.repeat 10
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
          confusionsOrder: ['aa','to']
          confusions:
            aa: 'They both start with “A”, so _some_ **dummies** get these two mixed up.'
            to: 'They both have shells.'

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
      help: "Actual option values are 16-digit alphanumeric strings or if presets from editor then specific ids."
      selects: [
        {
          id: "countryID"
          title: "Country (required:true)"
          required: true
          options: {
            '*': [
              {value: "USA-value", label: "United States of America"},
              {value: "Canada-value", label: "Canada"},
              {value: "Mypos-value", label: "Mypos"}
            ]
          }
        },
        {
          id: "stateID"
          title: "State (conditional:Country,required:true,allowCreate:false)"
          required: true
          allowCreate: false
          condition: "countryID"
          options: {
            'USA-value': [
              {value: "HI", label: "Hawaii"},
              {value: "IL", label: "Illinois"},
              {value: "WI", label: "Wisconsin"}
            ],
            'Canada-value': [
              {value: "AB", label: "Alberta"},
              {value: "ON", label: "Ontario"},
              {value: "QC", label: "Quebec"}
            ],
            'Mypos-value': [
              {value: "Gondor-value", label: "Gondor"},
              {value: "Rohan-value", label: "Rohan"},
              {value: "Shire-value", label: "Shire"}
            ]
          }
        },
        {
          id: "countyID"
          title: "County (condition:State,allowCreate:true)"
          allowCreate: true
          condition: "stateID"
          options: {
            'USA-value;HI': [
              {value: "Honolulu-value", label: "Honolulu"},
              {value: "Maui-value", label: "Maui"}
            ],
            'USA-value;IL': [
              {value: "Cook-value", label: "Cook"},
              {value: "Lake-value", label: "Lake"}
            ],
            'Canada-value;AB': [
              {value: "RockyView-value", label: "Rocky View"},
              {value: "Parkland-value", label: "Parkland"}
            ],
            'Canada-value;QC': [
              {value: "Montreal-value", label: "Montreal"},
              {value: "Capitale-Nationale-value", label: "Capitale-Nationale"}
            ],
            'Mypos-value;Rohan-value': [
              {value: "GothamCounty-value", label: "Gotham County"},
              {value: "MetropolisCounty-value", label: "Metropolis County"}
            ],
            'Mypos-value;Shire-value': [
              {value: "BikiniBottom-value", label: "Municipality of Bikini Bottom"},
              {value: "Elbonia-value", label: "Elbonia"}
            ]
          }
        },
        {
          id: "cityID"
          title: "City (condition:County,allowCreate:false)"
          allowCreate: false
          condition: "countyID"
          options: {
            'USA-value;HI;Honolulu-value': [
              {value: "Honolulu-value", label: "Honolulu city"}
            ],
            'USA-value;IL;Cook-value': [
              {value: "Chicago-value", label: "Chicago"},
              {value: "Evanston-value", label: "Evanston"}
            ],
            'USA-value;IL;Lake-value': [
              {value: "Waukegan-value", label: "Waukegan"},
              {value: "Wheeling-value", label: "Wheeling"}
            ],
            'Canada-value;AB;RockyView-value': [
              {value: "Airdrie-value", label: "Airdrie"},
              {value: "Chestermere-value", label: "Chestermere"}
            ],
            'Canada-value;QC;Capitale-Nationale-value': [
              {value: "QuebecCity-value", label: "Quebec City"},
              {value: "Saint-Raymond-value", label: "Saint-Raymond"}
            ],
            'Mypos-value;Rohan-value;GothamCounty-value': [
              {value: "Gotham-value", label: "Gotham"}
            ],
            'Mypos-value;Rohan-value;MetropolisCounty-value': [
              {value: "Metropolis-value", label: "Metropolis"}
            ],
            'Mypos-value;Shire-value;BikiniBottom-value': [
              {value: "BikiniBottom-value", label: "Bikini Bottom"}
            ],
            'Mypos-value;Shire-value;Elbonia-value': [
              {value: "Townbert-value", label: "Townbert"}
            ]
          }
        },
        {
          id: "teamID"
          title: "Best State Team (condition:State,allowCreate:true)"
          allowCreate: true
          condition: "stateID"
          options: {
            'USA-value;HI': [
              {value: "Sharks-value", label: "Sharks"},
              {value: "RainbowWarriors-value", label: "Rainbow Warriors"}
            ],
            'USA-value;IL': [
              {value: "Bears-value", label: "Bears"},
              {value: "Bulls-value", label: "Bulls"},
              {value: "Blackhawks-value", label: "Blackhawks"}
            ],
            'Canada-value;AB': [
              {value: "Oilers-value", label: "Oilers"},
              {value: "Flames-value", label: "Flames"}
            ],
            'Canada-value;QC': [
              {value: "Candiens-value", label: "Canadiens"},
              {value: "Expos-value", label: "Expos"}
            ],
            'Mypos-value;Shire-value': [
              {value: "MightyDucks-value", label: "Mighty Ducks"},
              {value: "LittleGiants-value", label: "Little Giants"}
            ],
            'Mypos-value;Rohan-value': [
              {value: "Shelbyvillians-value", label: "Shelbyville Shelbyvillians"},
              {value: "Isotopes-value", label: "Springfield Isotopes"}
            ]
          }
        }
      ]

    slider:
      type: 'slider'
      instruction: 'Slide me'
      min: '0'
      max: '10'
      step: '0.5'
      defaultValue: '3'

    highlight:
      type: 'highlighter'
      instruction: 'Highlight words and phrases with the mouse, then select categories.'
      highlighterLabels: [
        {
          label: 'Name',
          color: '#ff6639'
        },
        {
          label: 'Place',
          color: '#57c4f7'
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

labs1715QueryPresent = ->
  urlParams = new URLSearchParams(window.location.search);
  labs1715QueryPresent = urlParams.get('1715labs');
  console.log(labs1715QueryPresent);
  if labs1715QueryPresent then true else false

subject = apiClient.type('subjects').create
  id: 'MOCK_SUBJECT_FOR_CLASSIFIER'
  # Images originally from lorempixel.com shared under CC BY-SA,
  # but the service is often slow and/or fails to load at all.
  # Noted original source next to each.
  locations: if navigator?.onLine
    if labs1715QueryPresent()
      [
        {'image/jpeg': "#{window.location.origin}/assets/dev-classifier/1715_labs/london_street_view.jpeg"}
        {'image/jpeg': "#{window.location.origin}/assets/dev-classifier/1715_labs/greenwich_satellite_image.jpeg"}
        {'image/jpeg': "#{window.location.origin}/assets/dev-classifier/1715_labs/building_plans.jpeg"}
        {'text/plain': "#{window.location.origin}/assets/dev-classifier/algernon.txt"}
      ]
    else
      [
        {'image/jpeg': "#{window.location.origin}/assets/dev-classifier/landscape.jpeg"} # //lorempixel.com/900/600/animals/1
        {'image/jpeg': "#{window.location.origin}/assets/dev-classifier/portrait.jpeg"} # //lorempixel.com/600/900/animals/2
        {'image/jpeg': "#{window.location.origin}/assets/dev-classifier/very-wide.jpeg"} # //lorempixel.com/1900/1000/animals/3
        {'image/jpeg': "#{window.location.origin}/assets/dev-classifier/very-tall.jpeg"} # //lorempixel.com/1000/1900/animals/4
        {'image/jpeg': "#{window.location.origin}/assets/dev-classifier/small.jpeg"} # //lorempixel.com/400/300/animals/4
        {'text/plain': "#{window.location.origin}/assets/dev-classifier/algernon.txt"}
      ]
  else
    [
      {'image/png': BLANK_IMAGE}
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

project = apiClient.type('projects').create
  id: 'MOCK_PROJECT_FOR_CLASSIFIER'
  title: "The Dev Classifier"
  experimental_tools: []

preferences = apiClient.type('project_preferences').create
  preferences: {}

classification = apiClient.type('classifications').create
  annotations: []
  metadata: {}
  links:
    project: project.id
    workflow: workflow.id
    subjects: [subject.id]
  _workflow: workflow # TEMP
  _subjects: [subject] # TEMP


module.exports = {workflow, subject, classification, project, preferences}
window?.mockClassifierData = module.exports
