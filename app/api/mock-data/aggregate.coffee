apiClient = require '../client'

module.exports = apiClient.type('aggregate').create
  id: 'MOCK_AGGREGATE_FOR_AGGREGATE_VIEW'
  annotations: [{
    task: 'is_cool'
    value: 0
    sources: [{
      classification: 0
      annotation: 0
    }, {
      classification: 1
      annotation: 0
    }]
  }, {
    task: 'cool_stuff'
    value: [1]
    sources: [{
      classification: 0
      annotation: 1
    }, {
      classification: 1
      annotation: 1
    }]
  }, {
    task: 'coolest_point'
    value: [{
      tool: 0
      x: 50
      y: 50
      sources: [{
        classification: 0
        annotation: 2
        mark: 0
      }, {
        classification: 1
        annotation: 2
        mark: 0
      }]
    }]
  }]
  links:
    classifications:
      type: 'classifications'
      ids: [
        'MOCK_CLASSIFICATION_0_FOR_AGGREGATE_VIEW'
        'MOCK_CLASSIFICATION_1_FOR_AGGREGATE_VIEW'
      ]

apiClient.type('workflows').create
  id: 'MOCK_WORKFLOW_FOR_AGGREGATE_VIEW'
  first_task: 'is_cool'
  tasks: {
    is_cool: {
      type: 'single'
      question: 'Is this cool?'
      answers: [{
        label: 'Yes'
      }, {
        label: 'No'
      }]
    }
    cool_stuff: {
      type: 'multiple'
      question: 'What cool stuff is here?'
      answers: [{
        label: 'Ice'
      }, {
        label: 'Ice cream'
      }]
    }
    coolest_point: {
      type: 'drawing'
      instruction: 'Mark the coolest point'
      tools: [{
        type: 'point'
        label: 'Coolest point'
        color: 'blue'
      }, {
        type: 'rectangle'
        label: 'Something weird'
        color: 'green'
      }]
    }
  }

apiClient.type('subjects').create
  id: 'MOCK_SUBJECT_FOR_AGGREGATE_VIEW'
  locations: [{
    'image/png': '//placehold.it/100.png'
  }]
  links:
    workflow: type: 'workflows'
    id: 'MOCK_WORKFLOW_FOR_AGGREGATE_VIEW'

CLASSIFICATION_LINKS =
  workflow:
    type: 'workflows'
    id: 'MOCK_WORKFLOW_FOR_AGGREGATE_VIEW'
  subject:
    type: 'subjects'
    id: 'MOCK_SUBJECT_FOR_AGGREGATE_VIEW'

apiClient.type('classifications').create
  id: 'MOCK_CLASSIFICATION_0_FOR_AGGREGATE_VIEW'
  annotations: [{
    task: 'is_cool'
    value: 0
  }, {
    task: 'cool_stuff'
    value: [1]
  }, {
    task: 'coolest_point'
    value: [{
      tool: 0
      x: 55
      y: 55
    }]
  }]
  links: CLASSIFICATION_LINKS

apiClient.type('classifications').create
  id: 'MOCK_CLASSIFICATION_1_FOR_AGGREGATE_VIEW'
  annotations: [{
    task: 'is_cool'
    value: 0
  }, {
    task: 'cool_stuff'
    value: [1]
  }, {
    task: 'coolest_point'
    value: [{
      tool: 0
      x: 45
      y: 45
    }]
  }]
  links: CLASSIFICATION_LINKS
