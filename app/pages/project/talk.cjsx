React = require 'react'
{RouteHandler} = require 'react-router'
TalkInit = require '../../talk/init'
TalkBreadcrumbs = require '../../talk/breadcrumbs'

module.exports = React.createClass
  displayName: 'ProjectTalkPage'

  render: ->
    <div className="project-text-content talk project content-container">
      <TalkBreadcrumbs {...@props} />
      <RouteHandler {...@props} />
    </div>
