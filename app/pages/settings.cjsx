# @cjsx React.DOM

React = require 'react'
promiseToSetState = require '../lib/promise-to-set-state'
auth = require '../api/auth'
Link = require '../lib/link'
Route = require '../lib/route'
InPlaceForm = require '../components/in-place-form'

module.exports = React.createClass
  displayName: 'SettingsPage'

  mixins: [promiseToSetState]

  _user: null # This is only used to keep track of user change listeners.

  componentDidMount: ->
    @handleAuthChange()
    auth.listen @handleAuthChange

  componentWillUnmount: ->
    auth.stopListening @handleAuthChange

  handleAuthChange: ->
    userPromise = auth.checkCurrent()

    userPromise.then (user) =>
      unless user is @_user
        @_user?.stopListening 'change', @handleUserChange
        @_user = user
        @_user?.listen 'change', @handleUserChange

    @promiseToSetState user: userPromise

  handleUserChange: ->
    @forceUpdate()

  render: ->
    notSignedIn = not @state.user?
    loading = @state.user instanceof Promise
    saveInProgress = @state.saving instanceof Promise
    disabled = notSignedIn or loading or saveInProgress

    <div className="edit-account-page content-container tabbed-content" data-side="left">
      <div className="tabbed-content-tabs">
        <Link href="/settings" root={true} className="tabbed-content-tab">General</Link>
        <Link href="/settings/profile" className="tabbed-content-tab">Profile</Link>
      </div>

      <div className="content-container">
        <Route path="/settings">
          <InPlaceForm onSubmit={@saveUser}>
            <fieldset>
              <legend>Contact info</legend>
              <p>Email address</p>
              <input type="email" name="email" placeholder="you@example.com" value={@state.user?.email} disabled={disabled} />
              <p><small>We’ll never share this address.</small></p>
            </fieldset>

            <p><button type="submit" disabled={disabled}>Save account settings</button></p>
          </InPlaceForm>
        </Route>

        <Route path="/settings/profile">
          <InPlaceForm onSubmit={@saveUser}>
            <fieldset>
              <legend>Optional profile details</legend>
              <table className="for-text-fields">
                <tr>
                  <th>Your credited name</th>
                  <td>
                    <input type="text" name="credited_name" placeholder="John Smith" value={@state.user?.credited_name} onChange={@handleBoundInput} /><br />
                    <span className="form-help">We’ll use this to give acknowledgement in papers, on posters, etc.</span>
                  </td>
                </tr>
              </table>
            </fieldset>

            <p><button type="submit" disabled={disabled}>Save profile</button></p>
          </InPlaceForm>
        </Route>
      </div>
    </div>

  handleBoundInput: (e) ->
    changes = {}
    changes[e.target.name] = e.target.value
    @state.user.update changes

  saveUser: ->
    @promiseToSetState saving: @state.user?.save?()
