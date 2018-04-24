React = require 'react'
createReactClass = require 'create-react-class'
AutoSave = require '../../components/auto-save'
handleInputChange = require '../../lib/handle-input-change'
auth = require 'panoptes-client/lib/auth'

MIN_PASSWORD_LENGTH = 8

ChangePasswordForm = createReactClass
  displayName: 'ChangePasswordForm'

  getDefaultProps: ->
    user: {}

  getInitialState: ->
    old: ''
    new: ''
    confirmation: ''
    inProgress: false
    success: false
    error: null

  render: ->
    <form ref="form" method="POST" onSubmit={@handleSubmit}>
      <p>
        <strong>Change your password</strong>
      </p>

      <table className="standard-table">
        <tbody>
          <tr>
            <td><label htmlFor="currentPassword">Current password (required)</label></td>
            <td>
              <input type="password" id="currentPassword" className="standard-input" size="20" onChange={(e) => @setState old: e.target.value} required />
            </td>
          </tr>
          <tr>
            <td><label htmlFor="newPassword">New password (required)</label></td>
            <td>
              <input type="password" id="newPassword" className="standard-input" size="20" onChange={(e) => @setState new: e.target.value} required />
              {if @state.new.length isnt 0 and @tooShort()
                <small className="form-help error">That’s too short</small>}
            </td>
          </tr>
          <tr>
            <td><label htmlFor="confirmPassword">Confirm new password (required)</label></td>
            <td>
              <input type="password" id="confirmPassword" className="standard-input" size="20" onChange={(e) => @setState confirmation: e.target.value} required />
              {if @state.confirmation.length >= @state.new.length - 1 and @doesntMatch()
                <small className="form-help error">These don’t match</small>}
            </td>
          </tr>
        </tbody>
      </table>

      <p>
        <button type="submit" className="standard-button" disabled={not @state.old or not @state.new or @tooShort() or @doesntMatch() or @state.inProgress}>Change</button>{' '}

        {if @state.inProgress
          <i className="fa fa-spinner fa-spin form-help"></i>
        else if @state.success
          <i className="fa fa-check-circle form-help success"></i>
        else if @state.error
          <small className="form-help error">{@state.error.toString()}</small>}
      </p>
    </form>

  tooShort: ->
    @state.new.length < MIN_PASSWORD_LENGTH

  doesntMatch: ->
    @state.new isnt @state.confirmation

  handleSubmit: (e) ->
    e.preventDefault()

    current = @state.old
    replacement = @state.new

    @setState
      inProgress: true
      success: false
      error: null

    auth.changePassword {current, replacement}
      .then =>
        @setState success: true
        @refs.form.reset()
      .catch (error) =>
        @setState {error}
      .then =>
        @setState inProgress: false

module.exports = createReactClass
  displayName: "AccountInformationPage"

  render: ->
    <div className="account-information-tab">
      <div className="columns-container">
        <div className="content-container column">
          <p>
            <AutoSave resource={@props.user}>
              <span className="form-label"><label htmlFor="displayName">Display name (required)</label></span>
              <br />
              <input type="text" id="displayName" className="standard-input full" name="display_name" value={@props.user.display_name} onChange={handleInputChange.bind @props.user} />
            </AutoSave>
            <span className="form-help">How your name will appear to other users in Talk and on your Profile Page</span>
            <br />

            <AutoSave resource={@props.user}>
              <label htmlFor="realName"><span className="form-label">Real name (optional)</span></label>
              <br />
              <input type="text" id="realName" className="standard-input full" name="credited_name" value={@props.user.credited_name} onChange={handleInputChange.bind @props.user} />
            </AutoSave>
            <span className="form-help">Public; we’ll use this to give acknowledgement in papers, on posters, etc.</span>
          </p>
        </div>
      </div>

      <hr />

      <div className="content-container">
        <ChangePasswordForm {...@props} />
      </div>
    </div>
