tasks = require '../classifier/tasks'

module.exports = (unknown, knownGood, workflow) ->
  quality = 0

  differentTree = false

  unknown.annotations.forEach (annotation, i) ->
    unless differentTree
      correspondingKnownGoodAnnotation = knownGood.annotations[i]

      if annotation.task is correspondingKnownGoodAnnotation?.task
        taskDescription = workflow.tasks[annotation.task]
        TaskComponent = tasks[taskDescription.type]

        quality += TaskComponent.testAnnotationQuality annotation, correspondingKnownGoodAnnotation, workflow
      else
        differentTree = true

  potential = Math.max unknown.annotations.length, knownGood.annotations.length

  quality / potential
