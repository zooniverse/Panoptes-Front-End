React = require 'react'
apiClient = require '../api/client'
PromiseRenderer = require '../components/promise-renderer'
{Link} = require 'react-router'

module.exports = React.createClass
  displayName: 'ProjectCard'

  render: ->
    getAvatar = apiClient.get @props.project._getURL 'avatar'
      .then ([avatar]) ->
        avatar.src
      .catch ->
        ''

    getOwner = @props.project.get 'owner'

    getAvatarAndOwner = Promise.all [getAvatar, getOwner]

    <PromiseRenderer promise={getAvatarAndOwner} then={@renderWithDetails}>
      {@renderWithDetails []}
    </PromiseRenderer>

  renderWithDetails: ([avatar, owner]) ->
    linkProps =
      to: 'project-home'

      params:
        owner: owner?.display_name ? 'LOADING'
        name: @props.project.display_name

      style:
        backgroundImage: "url('#{avatar}')" if avatar

      'data-no-avatar': true unless avatar

    <Link {...linkProps} className="project-card">
      <svg className="project-card-space-maker" viewBox="0 0 2 1" width="100%"></svg>
      <div className="details">
        <div className="name">
          {@props.project.display_name}{' '}
          {if @props.project.configuration?.redirect
            <small><i className="fa fa-external-link form-help" title="This project was built separate from the Zooniverse platform."></i></small>}
        </div>
        <div className="owner">{owner?.display_name ? 'LOADING'}</div>
        <div className="description">{@props.project.description}</div>
      </div>
    </Link>
