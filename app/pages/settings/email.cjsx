React = require 'react'
talkClient = require 'panoptes-client/lib/talk-client'
AutoSave = require '../../components/auto-save'
PromiseRenderer = require '../../components/promise-renderer'
ChangeListener = require '../../components/change-listener'
handleInputChange = require '../../lib/handle-input-change'
apiClient = require 'panoptes-client/lib/api-client'

module.exports = React.createClass
  displayName: 'EmailSettingsPage'

  getDefaultProps: ->
    user: null

  getInitialState: ->
    page: 1
    projects: []
    projectPreferences: []

  componentWillMount: ->
    @getProjectPreferences()

  componentDidUpdate: (prevProps, prevState) ->
    unless @state.page is prevState.page
      @getProjectPreferences()

  getProjectPreferences: ->
    @props.user.get('project_preferences', page: @state.page)
      .then (projectPreferences) =>
        if projectPreferences
          projects = for preference in projectPreferences
            preference.get('project').catch =>
              null
          Promise.all(projects).then (projects) =>
            @setState
              meta: projectPreferences[0].getMeta()
              projects: projects
              projectPreferences: projectPreferences

  nameOfPreference: (preference) ->
    switch preference.category
      when 'participating_discussions' then "When discussions I'm participating in are updated"
      when 'followed_discussions' then "When discussions I'm following are updated"
      when 'mentions' then "When I'm mentioned"
      when 'group_mentions' then "When I'm mentioned by group (@admins, @team, etc)"
      when 'messages' then 'When I receive a private message'
      when 'started_discussions' then "When a discussion is started in a board I'm following"

  sortPreferences: (preferences) ->
    order = ['participating_discussions', 'followed_discussions', 'started_discussions', 'mentions', 'group_mentions', 'messages']
    preferences.sort (a, b) ->
      order.indexOf(a.category) > order.indexOf(b.category)

  handlePreferenceChange: (preference, event) ->
    preference.update(email_digest: event.target.value).save()

  talkPreferenceOption: (preference, digest) ->
    <td className="option">
      <input type="radio"
        name={preference.category}
        value={digest}
        checked={preference.email_digest is digest}
        onChange={@handlePreferenceChange.bind this, preference}
      />
    </td>

  render: ->
    <div className="content-container">
      <p>
        <AutoSave resource={@props.user}>
          <span className="form-label">Email address</span>
          <br />
          <input type="text" className="standard-input full" name="email" value={@props.user.email} onChange={handleInputChange.bind @props.user} />
        </AutoSave>
      </p>
      <p><strong>Zooniverse email preferences</strong></p>
      <p>
        <AutoSave resource={@props.user}>
          <label>
            <input type="checkbox" name="global_email_communication" checked={@props.user.global_email_communication} onChange={handleInputChange.bind @props.user} />{' '}
            Get general Zooniverse email updates
          </label>
        </AutoSave>
        <br />
        <AutoSave resource={@props.user}>
          <label>
            <input type="checkbox" name="project_email_communication" checked={@props.user.project_email_communication} onChange={handleInputChange.bind @props.user} />{' '}
            Get email updates from the Projects you classify on
          </label>
        </AutoSave>
        <br />
        <AutoSave resource={@props.user}>
          <label>
            <input type="checkbox" name="beta_email_communication" checked={@props.user.beta_email_communication} onChange={handleInputChange.bind @props.user} />{' '}
            Get beta project email updates and become a beta tester
          </label>
        </AutoSave>
      </p>

      <p><strong>Talk email preferences</strong></p>
      <table className="talk-email-preferences">
        <thead>
          <tr>
            <th>Send me an email</th>
            <th>Immediately</th>
            <th>Daily</th>
            <th>Weekly</th>
            <th>Never</th>
          </tr>
        </thead>
        <PromiseRenderer promise={talkClient.type('subscription_preferences').get()} pending={-> <tbody></tbody>} then={(preferences) =>
          <tbody>
            {for preference in @sortPreferences(preferences) when preference.category isnt 'system' and preference.category isnt 'moderation_reports' then do (preference) =>
              <ChangeListener key={preference.id} target={preference} handler={=>
                <tr>
                  <td>{@nameOfPreference(preference)}</td>
                  {@talkPreferenceOption preference, 'immediate'}
                  {@talkPreferenceOption preference, 'daily'}
                  {@talkPreferenceOption preference, 'weekly'}
                  {@talkPreferenceOption preference, 'never'}
                </tr>
              } />
            }
          </tbody>
        } />
      </table>

      <p><strong>Project email preferences</strong></p>
      <table>
        <thead>
          <tr>
            <th><i className="fa fa-envelope-o fa-fw"></i></th>
            <th>Project</th>
          </tr>
        </thead>
        <tbody>
          {@state.projectPreferences.map (projectPreference, i) =>
            if @state.projects[i]
              <tr key={i}>
                <td><input type="checkbox" name="email_communication" checked={projectPreference.email_communication} onChange={@handleProjectEmailChange.bind this, projectPreference} /></td>
                <td>{@state.projects[i].display_name}</td>
              </tr>}
          <tr>
            <td colSpan="2">
              {if @state.meta
                <nav className="pagination">
                  Page <select value={@state.page} disabled={@state.meta.page_count < 2} onChange={(e) => @setState page: e.target.value}>
                    {for p in [1..@state.meta.page_count]
                      <option key={p} value={p}>{p}</option>}
                  </select> of {@state.meta.page_count || '?'}
                </nav>}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

  handleProjectEmailChange: (projectPreference, args...) ->
    handleInputChange.apply projectPreference, args
    projectPreference.save()
    @forceUpdate()
