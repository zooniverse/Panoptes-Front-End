React = require 'react'
{Markdown} = require 'markdownz'
HandlePropChanges = require '../../lib/handle-prop-changes'
PromiseToSetState = require '../../lib/promise-to-set-state'
PromiseRenderer = require '../../components/promise-renderer'
FinishedBanner = require './finished-banner'
ProjectMetadata = require './metadata'
{Link} = require 'react-router'

module.exports = React.createClass
  displayName: 'ProjectHomePage'

  mixins: [HandlePropChanges, PromiseToSetState]

  propChangeHandlers:
    project: (project) ->
      # TODO: Build this kind of caching into json-api-client.
      if project._workflows?
        @setState workflows: project._workflows
      else
        workflows = project.get 'workflows', active: true

        workflows.then (workflows) =>
          project._workflows = workflows

        @promiseToSetState {workflows}

  getInitialState: ->
    workflows: []

  render: ->
    [owner, name] = @props.project.slug.split('/')

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
        else if @props.project.configuration?.user_chooses_workflow
          for workflow in @state.workflows
            <Link to={"/projects/#{owner}/#{name}/classify?workflow=#{workflow.id}"} key={workflow.id} className="call-to-action standard-button">
              {workflow.display_name}
            </Link>
        else
          <Link to={"/projects/#{owner}/#{name}/classify"} className="call-to-action standard-button">
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
