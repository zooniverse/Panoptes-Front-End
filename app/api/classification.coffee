{Resource, Model} = require 'json-api-client'
counterpart = require 'counterpart'
tasks = require '../classifier/tasks'

module.exports = class extends Resource
  annotations: null
  metadata: null

  constructor: ->
    super
    @update
      annotations: @annotations ? []
      metadata: @metadata ? {}
    @update
      'metadata.started_at': (new Date).toISOString()
      'metadata.user_agent': navigator.userAgent
      'metadata.user_language': counterpart.getLocale()

  annotate: (taskType, taskKey) ->
    annotation = tasks[taskType].getDefaultAnnotation?()
    annotation.task = taskKey
    @annotations.push annotation
    @update 'annotations'
    annotation

  handleAnnotationDestroy: (index) ->
    @annotations.splice index, 1
    @update 'annotations'
