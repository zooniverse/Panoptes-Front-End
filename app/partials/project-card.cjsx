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

  componentDidMount: ->
    card = @refs.projectCard.getDOMNode()

    @props.project.get('avatar')
      .then (avatar) =>
        card.style.backgroundImage = "url('#{avatar.src}')"
        card.style.backgroundSize = "contain"
      .catch =>
        card.style.background = "url('./assets/simple-pattern.jpg') center center repeat"

  render: ->
    <div className="project-card" ref="projectCard">
      <PromiseRenderer promise={@props.project.get 'owner'} pending={null}>{(owner) =>
        linkProps =
          to: 'project-home'
          params:
            owner: owner?.login ? 'LOADING'
            name: @props.project.slug

        <Link {...linkProps}>
          <svg className="project-card-space-maker" viewBox="0 0 2 1" width="100%" height="150px"></svg>
          <div className="details">
            <div className="name">{@props.project.display_name}</div>
            <div className="owner">{owner?.display_name ? 'LOADING'}</div>
            <button type="button" tabIndex="-1" className="ghost-button project-card-button"><Translate content="projectsCard.button" /></button>
          </div>
        </Link>
      }</PromiseRenderer>
    </div>
