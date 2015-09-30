React = require 'react'
{RouteHandler, Link} = require '@edpaget/react-router'
TalkInit = require '../../talk/init'
TalkBreadcrumbs = require '../../talk/breadcrumbs'
TalkSearchInput = require '../../talk/search-input'
projectSection = require '../../talk/lib/project-section'

module.exports = React.createClass
  displayName: 'ProjectTalkPage'
  render: ->
    <div className="project-text-content talk project">
      <div className="content-container">
        <h1 className="talk-main-link">
          <Link to="project-talk" params={@props.params}>
            {@props.project.display_name} Talk
          </Link>
        </h1>
        <TalkBreadcrumbs {...@props} />

        <TalkSearchInput {...@props} />

        <RouteHandler {...@props} section={projectSection(@props.project)}/>
      </div>
    </div>
