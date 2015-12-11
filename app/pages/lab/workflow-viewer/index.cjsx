React = require 'react'
apiClient = require '../../../api/client'
PromiseRenderer = require '../../../components/promise-renderer'
ChangeListener = require '../../../components/change-listener'
WorkflowNodes = require './workflow'
{Navigation} = require '@edpaget/react-router'

WorkflowVis = React.createClass
  displayName: 'WorkflowVis'

  mixins: [Navigation]

  getInitialState: ->
    # make a new jsPlumb instance each time component is mounted
    jp: jsPlumb.getInstance()

  onSort: ->
    @refs['workflowNodes'].sortTasks()

  workflowLink: ->
    [owner, name] = @props.project.slug.split('/')
    viewParams = {owner, name}
    viewQuery = workflow: @props.workflow.id, reload: 0
    @makeHref 'project-classify', viewParams, viewQuery

  render: ->
    <div>
      <div style={pointerEvents: 'all'}>
        <button className='standard-button' onClick={@onSort}>Sort Task Nodes</button>
      </div>
      <hr />
      <WorkflowNodes jp={@state.jp} workflow={@props.workflow} ref='workflowNodes' />
      <hr />
      <div style={pointerEvents: 'all'}>
        <a href={@workflowLink()} className="standard-button" target="from-lab" onClick={@handleViewClick}>Test this workflow</a>
      </div>
    </div>

module.exports = React.createClass
  displayName: 'WorkflowVisPageWrapper'

  propTypes:
    params: React.PropTypes.shape({projectId: React.PropTypes.string, workflowId: React.PropTypes.string})

  render: ->
    <PromiseRenderer promise={apiClient.type('workflows').get @props.params.workflowID}>{(workflow) =>
      <ChangeListener target={workflow}>{=>
        <WorkflowVis {...@props} workflow={workflow} ref='workflowVis' />
      }</ChangeListener>
    }</PromiseRenderer>
