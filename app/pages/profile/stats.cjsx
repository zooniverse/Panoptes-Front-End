React = require 'react'
apiClient = require 'panoptes-client/lib/api-client'
ClassificationsRibbon = require '../../components/classifications-ribbon'
PromiseRenderer = require '../../components/promise-renderer'
ProjectIcon = require '../../components/project-icon'

module.exports = React.createClass
  getDefaultProps: ->
    user: null
    profileUser: null
  
  getInitialState: ->
    projects: {}

  componentDidMount: ->
    @getProjectStats @props.profileUser if @props.user
    if @props.project? or @props.params?.profile_name?
      document.documentElement.classList.add 'on-secondary-page'

  componentWillUnmount: ->
    if @props.project? or @props.params?.profile_name?
      document.documentElement.classList.remove 'on-secondary-page'
  
  componentWillReceiveProps: (newProps) ->
    if @props.user isnt newProps.user
      @getProjectStats newProps.profileUser
  
  getProjectStats: (user) ->
    ClassificationsRibbon::getAllProjectPreferences user
      .then (projectPreferences) =>
        projectPreferences.map (projectPreference) =>
          apiClient.type 'projects'
            .get projectPreference.links.project
            .then (project) =>
              if projectPreference.activity_count > 0
                project.activity_count = projectPreference.activity_count
                @setState (state, props) -> 
                  projects = state.projects
                  projects[project.id] = project
                  {projects}

  render: ->
    <div className="content-container">
      <h3>Your contribution stats</h3>
      <p className="form-help">Users can only view their own stats.</p>
      {if @props.profileUser is @props.user
        # TODO: Braces after "style" here confuse coffee-reactify. That's really annoying.
        centered = textAlign: 'center'
        <div style=centered>
          <p><ClassificationsRibbon user={@props.profileUser} /></p>
          <div>
            {for id, project of @state.projects
              <span key="project#{id}">
                <ProjectIcon project={project} badge={project.activity_count} />
                &ensp;
              </span>}
          </div>
        </div>
      else
        <p>Sorry, we can’t show you stats for {@props.profileUser.display_name}.</p>}
    </div>
