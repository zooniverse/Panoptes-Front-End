React = require 'react'
BoundResourceMixin = require '../lib/bound-resource-mixin'
handleInputChange = require '../lib/handle-input-change'
ChangeListener = require '../components/change-listener'
auth = require '../api/auth'
PromiseRenderer = require '../components/promise-renderer'
ImageSelector = require '../components/image-selector'
apiClient = require '../api/client'

UserSettingsPage = React.createClass
  displayName: 'UserSettingsPage'

  mixins: [BoundResourceMixin]

  boundResource: 'user'

  getDefaultProps: ->
    user: {}

  render: ->
    <div>
      <div className="columns-container">
        <div className="content-container">
          Avatar<br />
          <ImageSelector ratio={1} maxSize={65536} onChange={@handleAvatarChange} />
        </div>

        <hr />

        <div className="content-container column">
          <table className="standard-table full">
            <tr>
              <th>Credited name</th>
              <td>
                <input type="text" className="standard-input full" name="credited_name" value={@props.user.credited_name} onChange={@handleChange} />
                <div className="form-help">Public; we’ll use this to give acknowledgement in papers, on posters, etc.</div>
              </td>
            </tr>
          </table>

          <p>
            <label>
              <input type="checkbox" name="global_email_communication" checked={@props.user.global_email_communication} onChange={@handleChange} />{' '}
              Get general Zooniverse email updates
            </label>
          </p>

          <p>
            <button type="button" className="standard-button" disabled={@state.saveInProgress or not @props.user.hasUnsavedChanges()} onClick={@saveResource}>Save profile</button>{' '}
            {@renderSaveStatus()}
          </p>
        </div>
      </div>

      <hr />

      <div className="content-container">
        <p><strong>Project email preferences</strong></p>
        <table>
          <thead>
            <tr>
              <th>Project</th>
              <th>Receive email updates</th>
            </tr>
          </thead>
          <PromiseRenderer promise={@props.user.get 'project_preferences'} pending={=> <tbody></tbody>} then={(projectPreferences) =>
            <tbody>
              {for projectPreference in projectPreferences
                <PromiseRenderer key={projectPreference.id} promise={projectPreference.get 'project'} then={(project) =>
                  <ChangeListener target={projectPreference} handler={=>
                    <tr>
                      <td>{project.display_name}</td>
                      <td><input type="checkbox" name="email_communication" checked={projectPreference.email_communication} onChange={@handleProjectEmailChange.bind this, projectPreference} /></td>
                    </tr>
                  } />
                } />}
            </tbody>
          } />
        </table>
      </div>
    </div>

  handleAvatarChange: (file) ->
    apiClient.put @props.user._getURL('avatar'), media: content_type: file.type
      .then =>
        console.log 'Posted image response:', arguments

  handleProjectEmailChange: (projectPreference, args...) ->
    handleInputChange.apply projectPreference, args
    projectPreference.save()

module.exports = React.createClass
  displayName: 'UserSettingsPageWrapper'

  render: ->
    <ChangeListener target={auth} handler={=>
      <PromiseRenderer promise={auth.checkCurrent()} then={(user) =>
        if user?
          <UserSettingsPage user={user} />
        else
          <div className="content-container">
            <p>You’re not signed in.</p>
          </div>
      } />
    } />
