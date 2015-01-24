{Resource, Model} = require 'json-api-client'
tasks = require '../classifier/tasks'

module.exports = class extends Resource
  annotations: null

  constructor: ->
    @started_at = (new Date).toISOString()
    @user_agent = navigator.userAgent
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
