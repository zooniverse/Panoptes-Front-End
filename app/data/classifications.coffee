Model = require '../data/model'
Store = require '../data/store'
subjectsStore = require './subjects'

class Classification extends Model
  subject: ''

  constructor: ->
    window.classification = this
    super
    @annotations ?= []

  save: ->
    console.log 'Saving', JSON.stringify this
    postClassification = new Promise (resolve, reject) ->
      console?.info 'POST /classifications', JSON.stringify this
      @apply =>
        @_saving = true
      setTimeout resolve, 1000

    postClassification.then =>
      @apply =>
        @_saving = false

module.exports = window.classificationsStore = new Store
  root: '/classifications'
  type: Classification

  # Map a project ID to a classification ID:
  inProgress: {}

  # 'classification:create': (subjectID) ->
  #   @items["FOR_#{subjectID}"] =
  #     subject: subjectID
  #     annotations: []

  # 'classification:annotation:create': (project, task) ->
  #   @classifiers[project.id].annotations.push {task}

  # 'classification:annotation:destroy-last': (project) ->
  #   @classifiers[project.id].annotations.pop()

  # 'classification:answer': (project, answer) ->
  #   annotations = @classifiers[project.id].annotations
  #   annotations[annotations.length - 1].answer = answer

  # This is a hack until there's an annotations store and a marks store.
  findClassificationAndAnnotationForMark: (mark) ->
    for project, classification of @inProgress when classification.annotations?
      for annotation in classification.annotations when annotation.marks?
        if mark in annotation.marks
          return {classification, annotation}

  'classification:annotation:mark:update': (mark, changes) ->
    {classification} = @findClassificationAndAnnotationForMark mark
    for key, value of changes
      mark[key] = value
    classification.emitChange()

  'classification:annotation:mark:delete': (mark) ->
    {classification, annotation} = @findClassificationAndAnnotationForMark mark
    markIndex = annotation.marks.indexOf mark
    annotation.marks.splice markIndex, 1
    classification.emitChange()
