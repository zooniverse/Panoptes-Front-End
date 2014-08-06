Store = require '../data/store'

EXAMPLE_SUBJECT =
  id: 'EXAMPLE_SUBJECT'
  location: ['//placehold.it/256.png&text=Subject']
  workflow: 'main'

module.exports = new Store
  classifications: {}

  'classification:create': (project) ->
    fetchSubject = new Promise (resolve, reject) ->
      setTimeout resolve.bind(null, EXAMPLE_SUBJECT), 1000

    fetchSubject.then (subject) =>
      firstTask = project.workflows[subject.workflow].firstTask
      @classifications[project.id] =
        subject: subject
        annotations: [{task: firstTask, marks: [{type: 'point', x: 10, y: 10}, {type: 'point', x: 30, y: 30}]}]

  'classification:annotation:create': (project, task) ->
    @classifications[project.id].annotations.push {task}

  'classification:annotation:destroy-last': (project) ->
    @classifications[project.id].annotations.pop()

  'classification:answer': (project, answer) ->
    annotations = @classifications[project.id].annotations
    annotations[annotations.length - 1].answer = answer

  'classification:save': (project) ->
    classification = @classifications[project.id]
    classification._saving = true
    @emitChange()

    postClassification = new Promise (resolve, reject) ->
      setTimeout resolve, 1000

    console?.info 'POST /classifications', JSON.stringify classification

    postClassification.then =>
      classification._saving = false
