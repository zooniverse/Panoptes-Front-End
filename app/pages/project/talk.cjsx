React = require 'react'
{RouteHandler, Navigation, Link} = require '@edpaget/react-router'
TalkInit = require '../../talk/init'
TalkBreadcrumbs = require '../../talk/breadcrumbs'
projectSection = require '../../talk/lib/project-section'

module.exports = React.createClass
  displayName: 'ProjectTalkPage'
  mixins: [Navigation]

  onSearchSubmit: (e) ->
    e.preventDefault()
    query = {query: React.findDOMNode(@refs.projectTalkSearchInput).value}
    @transitionTo 'project-talk-search', @props.params, query

  render: ->
    <div className="project-text-content talk project">
      <div className="content-container">
        <h1 className="talk-main-link">
          <Link to="project-talk" params={@props.params}>
            {@props.project.display_name} Talk
          </Link>
        </h1>
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
        <RouteHandler {...@props} section={projectSection(@props.project)}/>
      </div>
    </div>
