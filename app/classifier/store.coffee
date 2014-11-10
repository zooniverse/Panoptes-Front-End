Store = require '../mock-data/store'

EXAMPLE_SUBJECT =
  id: 'EXAMPLE_SUBJECT'
  location: ['//placehold.it/256.png&text=Subject']
  workflow: 'main'

module.exports = new Store
  classifiers: {}

  'classification:create': (project) ->
    fetchSubject = new Promise (resolve, reject) ->
      setTimeout resolve.bind(null, EXAMPLE_SUBJECT), 1000

    fetchSubject.then (subject) =>
      firstTask = project.workflows[subject.workflow].firstTask
      console.log 'Creating new classification', project.id, subject.id
      @classifiers[project.id] =
        subject: subject
        annotations: [{task: firstTask, marks: [{type: 'point', x: 10, y: 10}, {type: 'point', x: 30, y: 30}]}]

  'classification:annotation:create': (project, task) ->
    @classifiers[project.id].annotations.push {task}

  'classification:annotation:destroy-last': (project) ->
    @classifiers[project.id].annotations.pop()

  'classification:answer': (project, answer) ->
    annotations = @classifiers[project.id].annotations
    annotations[annotations.length - 1].answer = answer

  'classification:save': (project) ->
    classification = @classifiers[project.id]

    postClassification = new Promise (resolve, reject) ->
      console?.info 'POST /classifications', JSON.stringify classification
      classification._saving = true
      @emitChange()
      setTimeout resolve, 1000

    postClassification.then =>
      classification._saving = false
