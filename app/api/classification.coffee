{Resource, Model} = require 'json-api-client'
counterpart = require 'counterpart'
tasks = require '../classifier/tasks'

module.exports = class extends Resource
  annotations: null

  constructor: ->
    @metadata =
      started_at: (new Date).toISOString()
      user_agent: navigator.userAgent
      user_language: counterpart.getLocale()
    @annotations = []
    super

  annotate: (taskType, taskKey) ->
    annotation = new Model task: taskKey, tasks[taskType].getDefaultAnnotation?()
    annotation.listen [@, 'emit']

    @update annotations: =>
      @annotations.push annotation
      annotation.listen 'destroy', [@, 'handleAnnotationDestroy', @annotations.indexOf annotation]
      @annotations

    annotation

  handleAnnotationDestroy: (index) ->
    @update annotations: =>
      @annotations.splice index, 1
      @annotations
