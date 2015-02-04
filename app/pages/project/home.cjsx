counterpart = require 'counterpart'
React = require 'react'
PromiseRenderer = require '../../components/promise-renderer'
Translate = require 'react-translate-component'
Markdown = require '../../components/markdown'
{Link} = require 'react-router'

counterpart.registerTranslations 'en',
  project:
    home:
      getStarted: 'Get started'

module.exports = React.createClass
  displayName: 'ProjectHomePage'

  render: ->
    <div className="project-home-page">
      <div className="call-to-action-container content-container">
        <Markdown className="description">{@props.project.description}</Markdown>
        <PromiseRenderer promise={@props.project.link 'owner'} then={@renderCallToAction} />
      </div>
      <hr />
      <Markdown className="introduction content-container">
        {@props.project.introduction}
      </Markdown>
    </div>

  renderCallToAction: (owner) ->
    <Link to="project-classify" params={owner: owner.login, name: @props.project.display_name} className="call-to-action">
      <Translate content="project.home.getStarted" />
    </Link>
