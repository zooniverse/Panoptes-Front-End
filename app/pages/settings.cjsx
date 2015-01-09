React = require 'react'
promiseToSetState = require '../lib/promise-to-set-state'
auth = require '../api/auth'
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
        <a href="/settings" root={true} className="tabbed-content-tab">Profile</a>
      </div>

      <div className="content-container">
          <InPlaceForm onSubmit={@saveUser}>
            <fieldset>
              <legend>Optional profile details</legend>
              <table className="for-text-fields">
                <tr>
                  <th>Your credited name</th>
                  <td>
                    <input type="text" name="credited_name" placeholder="John Smith" value={@state.user?.credited_name} disabled={disabled} onChange={@handleBoundInput} /><br />
                    <span className="form-help">We’ll use this to give acknowledgement in papers, on posters, etc.</span>
                  </td>
                </tr>
              </table>
            </fieldset>

            <p><button type="submit" disabled={disabled}>Save profile</button></p>
          </InPlaceForm>
      </div>
    </div>

  handleBoundInput: (e) ->
    changes = {}
    changes[e.target.name] = e.target.value
    @state.user.update changes

  saveUser: ->
    save = @state.user.save()

    save.catch ({errors}) ->
      errorMessage = (message for {message} in errors).join '\n'
      alert errorMessage # TODO: Something nicer

    @promiseToSetState saving: save
