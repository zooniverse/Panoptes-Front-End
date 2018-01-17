React = require 'react'
PropTypes = require 'prop-types'
createReactClass = require 'create-react-class'
{Link} = require 'react-router'
{ Helmet } = require 'react-helmet'
counterpart = require 'counterpart'
TalkBreadcrumbs = require '../../talk/breadcrumbs'
TalkSearchInput = require '../../talk/search-input'
projectSection = require '../../talk/lib/project-section'
TalkFootnote = require '../../talk/footnote'

counterpart.registerTranslations 'en',
  projectTalk:
    title: 'Talk'

module.exports = createReactClass
  displayName: 'ProjectTalkPage'

  contextTypes:
    geordi: PropTypes.object

  logGeordi: ->
    @context.geordi?.logEvent
      type: "breadcrumb"

  componentWillMount: ->
    @context?.geordi?.logEvent type: 'talk-view'

  render: ->
    [owner, name] = @props.project.slug.split('/')

    <div className="project-text-content talk project">
      <Helmet title="#{@props.project.display_name} » #{counterpart 'projectTalk.title'}" />
      <div className="content-container">
        <h1 className="talk-main-link">
          <Link to="/projects/#{owner}/#{name}/talk" onClick={@logGeordi.bind null, this}>
            {@props.project.display_name} Talk
          </Link>
        </h1>
        <TalkBreadcrumbs {...@props} />

        <TalkSearchInput {...@props} />

        {React.cloneElement @props.children, {section: projectSection(@props.project), project: @props.project, user: @props.user}}

        <TalkFootnote />
      </div>
    </div>
