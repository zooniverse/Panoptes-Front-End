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
    <div className="project-home-content">
      <div className="call-to-action-container content-container">
        <Markdown className="introduction">{@props.project.introduction}</Markdown>
        <div>
          <PromiseRenderer promise={@props.project.link 'owner'} then={@renderCallToAction} />
        </div>
      </div>

      <Markdown className="description content-container">
        {@props.project.description}
      </Markdown>
    </div>

  renderCallToAction: (owner) ->
    <Link to="project-classify" params={owner: owner.login, name: @props.project.display_name} className="call-to-action">
      <Translate content="project.home.getStarted" />{' '}
      <i className="fa fa-arrow-circle-right"></i>
    </Link>
