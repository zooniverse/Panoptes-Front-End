React = require 'react'
{RouteHandler} = require 'react-router'
TalkInit = require '../../talk/init'
TalkBreadcrumbs = require '../../talk/breadcrumbs'
CurrentSection = require '../../talk/mixins/current-section' # @state.currentSection

module.exports = React.createClass
  displayName: 'ProjectTalkPage'
  mixins: [CurrentSection]

  render: ->
    <div className="project-text-content talk project content-container">
      <TalkBreadcrumbs {...@props} />
      <RouteHandler {...@props} section={@state.currentSection}/>
    </div>
