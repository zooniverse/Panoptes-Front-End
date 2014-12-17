React = require 'react'
apiClient = require '../api/client'
PromiseRenderer = require '../components/promise-renderer'
Classifier = require '../classifier/classifier'

module.exports = React.createClass
  displayName: 'ClassifyPage'

  render: ->
    workflow = @props.project.attr('workflows').then (workflows) ->
      # TODO: Allow workflow selection, maybe?
      workflows[Math.floor Math.random() * workflows.length]

    subject = workflow.then (workflow) =>
      apiClient.createType('subjects').get({
        project_id: @props.project.id
        workflow_id: workflow.id
        sort: 'cellect'
      }, 1).then (subjects) ->
        console.log 'Got these subjects', subjects
        subjects[Math.floor Math.random() * subjects.length]

    classification = Promise.all([workflow, subject]).then ([workflow, subject]) =>
      initialAnnotation = task: workflow.first_task ? Object.keys(workflow.tasks)[0]
      classification = apiClient.createType('classifications').createResource
        annotations: [initialAnnotation]
        links:
          project: @props.project.id
          workflow: workflow.id
          subject: subject.id
      window.classification = classification
      classification

    <PromiseRenderer promise={Promise.all [workflow, subject, classification]} then={@renderClassifier} />

  renderClassifier: ([workflow, subject, classification]) ->
    <Classifier workflow={workflow} subject={subject} classification={classification} onFinishClassification={@handleFinishingClassification} />

  handleFinishingClassification: (classification) ->
    console.info 'FINISHED', JSON.stringify classification
    alert 'TODO: Save the classification and load another subject.'
