counterpart = require 'counterpart'
React = require 'react'
Markdown = require '../../components/markdown'
{Link} = require 'react-router'
Translate = require 'react-translate-component'

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

        <Link to="project-classify" params={owner: @props.owner.display_name, name: @props.project.display_name} className="call-to-action">
          <Translate content="project.home.getStarted" />
        </Link>
      </div>

      <hr />

      <Markdown className="introduction content-container">{@props.project.introduction}</Markdown>
    </div>
