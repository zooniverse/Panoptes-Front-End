React = require 'react'
{Link} = require 'react-router'
TalkInit = require '../../talk/init'
TalkBreadcrumbs = require '../../talk/breadcrumbs'
TalkSearchInput = require '../../talk/search-input'
projectSection = require '../../talk/lib/project-section'
TalkFootnote = require '../../talk/footnote'

module.exports = React.createClass
  displayName: 'ProjectTalkPage'

  render: ->
    [owner, name] = @props.project.slug.split('/')

    <div className="project-text-content talk project">
      <div className="content-container">
        <h1 className="talk-main-link">
          <Link to="/projects/#{owner}/#{name}/talk">
            {@props.project.display_name} Talk
          </Link>
        </h1>
        <TalkBreadcrumbs {...@props} />

        <TalkSearchInput {...@props} />

        {React.cloneElement @props.children, {section: projectSection(@props.project), project: @props.project, user: @props.user}}

        <TalkFootnote />
      </div>
    </div>
