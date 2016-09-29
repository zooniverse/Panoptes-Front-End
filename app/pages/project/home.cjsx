React = require 'react'
{Markdown} = (require 'markdownz').default
FinishedBanner = require './finished-banner'
ProjectMetadata = require './metadata'
getWorkflowsInOrder = require '../../lib/get-workflows-in-order'
{Link} = require 'react-router'

module.exports = React.createClass
  displayName: 'ProjectHomePage'

  contextTypes:
    geordi: React.PropTypes.object

  getDefaultProps: ->
    activeWorkflows: []
    owner: {}
    project: {}
    user: null

  handleWorkflowSelection: (workflow) ->
    @props.onChangePreferences 'preferences.selected_workflow', workflow?.id
    undefined # Don't prevent default Link behavior.

  render: ->
    <div className="project-home-page">
      <div className="call-to-action-container content-container">
        <FinishedBanner project={@props.project} />

        <div className="description">{@props.project.description}</div>
        {if @props.project.workflow_description? and @props.project.workflow_description isnt ''
          <div className="workflow-description">{@props.project.workflow_description}</div>}

        {if @props.project.redirect
          <a href={@props.project.redirect} className="call-to-action standard-button">
            <strong>Visit the project</strong><br />
            <small>at {@props.project.redirect}</small>
          </a>
        # For Gravity Spy
        else if @props.project.experimental_tools.indexOf('workflow assignment') isnt -1
          if @props.user?
            currentWorkflowAtLevel = @props.activeWorkflows?.filter (workflow) =>
              workflow if workflow.id is @props.preferences?.settings.workflow_id
            currentLevel = if currentWorkflowAtLevel.length > 0 then currentWorkflowAtLevel[0].configuration.level else 1
            @props.activeWorkflows?.map (workflow) =>
              if workflow.configuration.level <= currentLevel and workflow.configuration.level?
                <Link
                  to={"/projects/#{@props.project.slug}/classify"}
                  key={workflow.id + Math.random()}
                  className="call-to-action standard-button"
                  onClick={@handleWorkflowSelection.bind this, workflow}
                >
                  You've unlocked level {workflow.display_name}
                </Link>
          else
            <Link to={"/projects/#{@props.project.slug}/classify"} className="call-to-action standard-button">
              Get started!
            </Link>
        else if @props.project.configuration?.user_chooses_workflow
          @props.activeWorkflows.map (workflow) =>
            <Link
              to={"/projects/#{@props.project.slug}/classify"}
              key={workflow.id + Math.random()}
              className="call-to-action standard-button"
              onClick={@handleWorkflowSelection.bind this, workflow}
            >
              {workflow.display_name}
            </Link>
        else
          <Link to={"/projects/#{@props.project.slug}/classify"} className="call-to-action standard-button">
            Get started!
          </Link>}
      </div>

      <hr />
      <div className="introduction content-container">
        <h3 className="about-project">About {@props.project.display_name}</h3>
        <Markdown project={@props.project}>{@props.project.introduction ? ''}</Markdown>
      </div>

      <ProjectMetadata project={@props.project} />
    </div>
