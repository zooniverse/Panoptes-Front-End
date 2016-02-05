React = require 'react'
apiClient = require 'panoptes-client/lib/api-client'
PromiseRenderer = require '../../../components/promise-renderer'
ChangeListener = require '../../../components/change-listener'
WorkflowNodes = require './workflow'
{History, Navigation} = require 'react-router'

WorkflowVis = React.createClass
  displayName: 'WorkflowVis'

  mixins: [History, Navigation]

  getInitialState: ->
    # make a new jsPlumb instance each time component is mounted
    jp: jsPlumb.getInstance()

  onSort: ->
    @refs['workflowNodes'].sortTasks()

  workflowLink: ->
    [owner, name] = @props.project.slug.split('/')
    viewQuery = workflow: @props.workflow.id, reload: 0
    @history.createHref("/projects/#{owner}/#{name}/classify", viewQuery)

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
