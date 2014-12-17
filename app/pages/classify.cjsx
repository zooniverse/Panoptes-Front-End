React = require 'react'
apiClient = require '../api/client'
PromiseRenderer = require '../components/promise-renderer'
Classifier = require '../classifier/classifier'

module.exports = React.createClass
  displayName: 'ClassifyPage'

  render: ->
    workflow = @props.project.attr('workflows').then ([workflow]) =>
      workflow

    subject = workflow.then (workflow) =>
      apiClient.createType('subjects').get({
        project_id: @props.project.id
        workflow_id: workflow.id
      }, 1).then ([subject]) ->
        subject

    classification = Promise.all([workflow, subject]).then ([workflow, subject]) ->
      initialAnnotation = task: workflow.first_task ? Object.keys(workflow.tasks)[0]
      classification = apiClient.createType('classifications').createResource
        annotations: [initialAnnotation]
        links:
          subjects: [subject.id]
      window.classification = classification
      classification

    <PromiseRenderer promise={Promise.all [workflow, subject, classification]} then={@renderClassifier} />

  renderClassifier: ([workflow, subject, classification]) ->
    <Classifier workflow={workflow} subject={subject} classification={classification} onFinishClassification={@handleFinishingClassification} />

  handleFinishingClassification: (classification) ->
    console.info 'FINISHED', JSON.stringify classification
    alert 'TODO: Save the classification and load another subject.'
