React = require 'react'
talkClient = require '../../api/talk'
AutoSave = require '../../components/auto-save'
PromiseRenderer = require '../../components/promise-renderer'
ChangeListener = require '../../components/change-listener'
handleInputChange = require '../../lib/handle-input-change'

module.exports = React.createClass
  displayName: 'EmailSettingsPage'

  getDefaultProps: ->
    user: null

  nameOfPreference: (preference) ->
    switch preference.category
      when 'participating_discussions' then "When discussions I'm participating in are updated"
      when 'followed_discussions' then "When discussions I'm following are updated"
      when 'mentions' then "When I'm mentioned"
      when 'messages' then 'When I receive a private message'

  sortPreferences: (preferences) ->
    order = ['participating_discussions', 'followed_discussions', 'mentions', 'messages']
    preferences.sort (a, b) ->
      order.indexOf(a.category) > order.indexOf(b.category)

  handlePreferenceChange: (preference, event) ->
    preference.update(email_digest: event.target.value).save()

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
            Get beta project email updates
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
            {for preference in @sortPreferences(preferences) when preference.category isnt 'system' then do (preference) =>
              <ChangeListener key={preference.id} target={preference} handler={=>
                <tr>
                  <td className="label">{@nameOfPreference(preference)}</td>
                  <td className="option"><input type="radio" name={preference.category} value="immediate" checked={preference.email_digest is 'immediate'} onChange={@handlePreferenceChange.bind this, preference} /></td>
                  <td className="option"><input type="radio" name={preference.category} value="daily" checked={preference.email_digest is 'daily'} onChange={@handlePreferenceChange.bind this, preference} /></td>
                  <td className="option"><input type="radio" name={preference.category} value="weekly" checked={preference.email_digest is 'weekly'} onChange={@handlePreferenceChange.bind this, preference} /></td>
                  <td className="option"><input type="radio" name={preference.category} value="never" checked={preference.email_digest is 'never'} onChange={@handlePreferenceChange.bind this, preference} /></td>
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
        <PromiseRenderer promise={@props.user.get 'project_preferences'} pending={=> <tbody></tbody>} then={(projectPreferences) =>
          <tbody>
            {for projectPreference in projectPreferences then do (projectPreference) =>
              <PromiseRenderer key={projectPreference.id} promise={projectPreference.get 'project'} then={(project) =>
                <ChangeListener target={projectPreference} handler={=>
                  <tr>
                    <td><input type="checkbox" name="email_communication" checked={projectPreference.email_communication} onChange={@handleProjectEmailChange.bind this, projectPreference} /></td>
                    <td>{project.display_name}</td>
                  </tr>
                } />
              } />}
          </tbody>
        } />
      </table>
    </div>

  handleProjectEmailChange: (projectPreference, args...) ->
    handleInputChange.apply projectPreference, args
    projectPreference.save()
