{Resource, Model} = require 'json-api-client'
counterpart = require 'counterpart'
tasks = require '../classifier/tasks'

module.exports = class extends Resource
  annotations: null

  constructor: ->
    super
    @update
      annotations: []
      metadata:
        started_at: (new Date).toISOString()
        user_agent: navigator.userAgent
        user_language: counterpart.getLocale()

  annotate: (taskType, taskKey) ->
    annotation = new Model task: taskKey, tasks[taskType].getDefaultAnnotation?()
    annotation.listen 'change', [@, 'emit', 'change']
    @annotations.push annotation
    annotation.listen 'destroy', [@, 'handleAnnotationDestroy', @annotations.indexOf annotation]
    @update 'annotations'
    annotation

  handleAnnotationDestroy: (index) ->
    @annotations.splice index, 1
    @update 'annotations'
