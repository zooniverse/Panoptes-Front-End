React = require 'react'
BoundResourceMixin = require '../lib/bound-resource-mixin'
ChangeListener = require '../components/change-listener'
auth = require '../api/auth'
PromiseRenderer = require '../components/promise-renderer'

UserSettingsPage = React.createClass
  displayName: 'UserSettingsPage'

  mixins: [BoundResourceMixin]

  boundResource: 'user'

  getDefaultProps: ->
    user: {}

  render: ->
    <div className="content-container">
      <table className="standard-table full">
        <tr>
          <th>Credited name</th>
          <td>
            <input type="text" className="standard-input full" name="credited_name" value={@props.user.credited_name} onChange={@handleChange} />
            <div className="form-help">We’ll use this to give acknowledgement in papers, on posters, etc.</div>
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
        <button type="button" disabled={@state.saveInProgress or not @props.user.hasUnsavedChanges()} onClick={@saveResource}>Save profile</button>{' '}
        {@renderSaveStatus()}
      </p>

      <hr />

      <p><strong>Email preferences</strong></p>

      <p>TODO</p>
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
