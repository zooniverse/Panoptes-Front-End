Store = {Model} = require '../data/store'
subjectsStore = require './subjects'

class Classification extends Model
  subject: ''

  constructor: ->
    window.classification = this
    super
    @annotations ?= []

  save: ->
    console.log 'Saving', JSON.stringify this
    # postClassification = new Promise (resolve, reject) ->
    #   console?.info 'POST /classifications', JSON.stringify this
    #   @apply =>
    #     @_saving = true
    #   setTimeout resolve, 1000

    # postClassification.then =>
    #   @apply =>
    #     @_saving = false

module.exports = window.classificationsStore = new Store
  root: '/classifications'
  type: Classification

  'classification:create': (subjectID) ->
    @items["FOR_#{subjectID}"] =
      subject: subjectID
      annotations: []

  # 'classification:annotation:create': (project, task) ->
  #   @classifiers[project.id].annotations.push {task}

  # 'classification:annotation:destroy-last': (project) ->
  #   @classifiers[project.id].annotations.pop()

  # 'classification:answer': (project, answer) ->
  #   annotations = @classifiers[project.id].annotations
  #   annotations[annotations.length - 1].answer = answer
