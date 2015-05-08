React = require 'react'
BoundResourceMixin = require '../lib/bound-resource-mixin'
ChangeListener = require '../components/change-listener'
auth = require '../api/auth'
PromiseRenderer = require '../components/promise-renderer'
ImageSelector = require '../components/image-selector'

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
          <ImageSelector ratio={1} maxSize={65536} />
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

            <tr>
              <th>Any other stuff?</th>
              <td>
                TODO
              </td>
            </tr>
          </table>

          <p>
            <button type="button" className="standard-button" disabled={@state.saveInProgress or not @props.user.hasUnsavedChanges()} onClick={@saveResource}>Save profile</button>{' '}
            {@renderSaveStatus()}
          </p>
        </div>
      </div>

      <hr />
      <div className="content-container">
        <p><strong>Email preferences</strong></p>
        <p>TODO</p>
      </div>
    </div>

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
