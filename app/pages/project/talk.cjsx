React = require 'react'
{RouteHandler, Navigation} = require 'react-router'
TalkInit = require '../../talk/init'
TalkBreadcrumbs = require '../../talk/breadcrumbs'
currentSection = require '../../talk/lib/current-section'

module.exports = React.createClass
  displayName: 'ProjectTalkPage'
  mixins: [Navigation]

  onSearchSubmit: (e) ->
    e.preventDefault()
    query = {query: React.findDOMNode(@refs.projectTalkSearchInput).value}
    @transitionTo 'project-talk-search', @props.params, query

  render: ->
    <div className="project-text-content talk project content-container">
      <TalkBreadcrumbs {...@props} />

      <form className="talk-search-form" onSubmit={@onSearchSubmit}>
        <input type="text"
          defaultValue={@props.query?.query}
          placeholder="Search..."
          ref="projectTalkSearchInput">
        </input>
        <button type="submit">
          <i className="fa fa-search" />
        </button>
      </form>

      <RouteHandler {...@props} section={currentSection(@props.project)}/>
    </div>
