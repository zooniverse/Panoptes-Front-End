React = require 'react'
ClassificationsRibbon = require '../../components/classifications-ribbon'
PromiseRenderer = require '../../components/promise-renderer'
ProjectIcon = require '../../components/project-icon'

module.exports = React.createClass
  getDefaultProps: ->
    user: null

  componentDidMount: ->
    if @props.project?
      document.documentElement.classList.add 'on-secondary-page'

  componentWillUnmount: ->
    if @props.project?
      document.documentElement.classList.remove 'on-secondary-page'

  render: ->
    <div className="content-container">
      <h3>Your contribution stats</h3>
      <p className="form-help">Users can only view their own stats.</p>
      {if @props.profileUser is @props.user
        # TODO: Braces after "style" here confuse coffee-reactify. That's really annoying.
        centered = textAlign: 'center'
        <div style=centered>
          <p><ClassificationsRibbon user={@props.profileUser} /></p>
          <PromiseRenderer promise={ClassificationsRibbon::getAllProjectPreferences @props.profileUser} then={(projectPreferences) =>
            <div>
              {projectPreferences.map (projectPreference) =>
                if projectPreference.activity_count > 0
                  <PromiseRenderer key={projectPreference.id} promise={projectPreference.get 'project'} catch={null} then={(project) =>
                    if project?
                      <span>
                        <ProjectIcon project={project} badge={projectPreference.activity_count} />
                        &ensp;
                      </span>
                    else
                      null
                  } />}
            </div>
          } />
        </div>
      else
        <p>Sorry, we can’t show you stats for {@props.profileUser.display_name}.</p>}
    </div>
