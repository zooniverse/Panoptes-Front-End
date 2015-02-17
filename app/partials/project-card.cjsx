React = require 'react'
PromiseRenderer = require '../components/promise-renderer'
{Link} = require 'react-router'

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
      <svg className="project-card-space-maker" viewBox="0 0 2 1" width="100%"></svg>
      <div className="details">
        <div className="name">{@props.project.display_name}</div>
        <div className="owner">{owner?.display_name ? 'LOADING'}</div>
        <div className="description">{@props.project.description}</div>
      </div>
    </Link>
