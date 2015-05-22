React = require 'react'
PromiseRenderer = require '../components/promise-renderer'
{Link} = require 'react-router'

counterpart = require 'counterpart'
Translate = require 'react-translate-component'

counterpart.registerTranslations 'en',
  projectsCard:
    button: 'Get Started'

module.exports = React.createClass
  displayName: 'ProjectCard'

  render: ->
    <PromiseRenderer promise={@props.project.get 'owner'} then={@renderWithOwner}>
      {@renderWithOwner()}
    </PromiseRenderer>

  renderWithOwner: (owner) ->
    linkProps =
      to: 'project-home'
      params:
        owner: owner?.display_name ? 'LOADING'
        name: @props.project.display_name

      style:
        backgroundImage: "url('#{@props.project.avatar}')" if @props.project.avatar

      'data-no-avatar': true unless @props.project.avatar

    <Link {...linkProps} className="project-card">
      <svg className="project-card-space-maker" viewBox="0 0 2 1" width="100%" height="150px"></svg>
      <div className="details">
        <div className="name">{@props.project.display_name}</div>
        <div className="owner">{owner?.display_name ? 'LOADING'}</div>
        <button type="button" tabIndex="-1" className="ghost-button project-card-button"><Translate content="projectsCard.button" /></button>
      </div>
    </Link>
