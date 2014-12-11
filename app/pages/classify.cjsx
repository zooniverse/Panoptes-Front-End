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

    classification = subject.then (subject) =>
      apiClient.createType('classifications').createResource
        annotations: []
        links:
          subjects: [subject.id]

    <PromiseRenderer promise={Promise.all [workflow, subject, classification]} then={@renderClassifier} />

  renderClassifier: ([workflow, subject, classification]) ->
    <Classifier workflow={workflow} subject={subject} classification={classification} />
