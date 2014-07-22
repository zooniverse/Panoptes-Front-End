# @cjsx React.DOM

React = require 'react'
currentUserActions = require '../actions/current-user'
ChildRouter = require 'react-child-router'
InPlaceForm = require '../components/in-place-form'

module.exports = React.createClass
  displayName: 'EditAccountPage'

  getInitialState: ->
    newPassword: ''
    newPasswordConfirmation: ''

  handlePropertyInputChange: (e) ->
    property = 'value'
    if e.target.type in ['radio', 'checkbox']
      property = 'checked'
    currentUserActions.set e.target.name, e.target[property]

  handleStateInput: (e) ->
    property = 'value'
    if e.target.type in ['radio', 'checkbox']
      property = 'checked'

    newState = {}
    newState[e.target.name] = e.target[property]

    @setState newState

  render: ->
    <div className="edit-account-page content-container tabbed-content" data-side="left">
      <div className="tabbed-content-tabs">
        <a href="#/edit/account" className="tabbed-content-tab">General</a>
        <a href="#/edit/account/password" className="tabbed-content-tab">Password</a>
        <a href="#/edit/account/profile" className="tabbed-content-tab">Profile</a>
        <a href="#/edit/account/roles" className="tabbed-content-tab">Roles</a>
        <a href="#/edit/account/notifications" className="tabbed-content-tab">Notifications</a>
        <a href="#/edit/account/groups" className="tabbed-content-tab">Groups</a>
        <a href="#/edit/account/projects" className="tabbed-content-tab">Projects</a>
        <a href="#/edit/account/subjects" className="tabbed-content-tab">Subjects</a>
        <a href="#/edit/account/advanced" className="tabbed-content-tab">Advanced</a>
      </div>

      <ChildRouter className="content-container">
        <div hash="#/edit/account">
          <InPlaceForm method="put" onSubmit={currentUserActions.save.bind currentUserActions, 'login', 'email', 'wants_betas', 'can_survey'}>
            <fieldset>
              <legend>Login name</legend>
              <p>This feature won’t be quite as discoverable as this.</p>
              <input type="text" name="login" value={@props.user.login} placeholder="cool_guy_123" onChange={@handlePropertyInputChange} />
            </fieldset>

            <fieldset>
              <legend>Contact info</legend>
              <p>Email address</p>
              <input type="email" name="email" value={@props.user.email} placeholder="me@example.com" onChange={@handlePropertyInputChange} />
              <p><small>We’ll never share this address. You can edit your public contact information in your profile</small></p>
            </fieldset>

            <fieldset>
              <legend>Contact preferences</legend>
              <table className="for-checkboxes">
                <tr>
                  <td>
                    <input type="checkbox" name="wants_betas" checked={@props.user.wants_betas} onChange={@handlePropertyInputChange} />
                  </td>
                  <td>
                    <label>I want to help test new projects under development.</label>
                  </td>
                </tr>
                <tr>
                  <td>
                    <input type="checkbox" name="can_survey" checked={@props.user.can_survey} onChange={@handlePropertyInputChange} />
                  </td>
                  <td>
                    <label>I’m willing to take part in occasional surveys from the Zooniverse and associated scientists.</label>
                  </td>
                </tr>
              </table>

              <button type="submit">Save account settings</button>
            </fieldset>
          </InPlaceForm>
        </div>

        <div hash="#/edit/account/password">
          <fieldset>
            <legend>Change your password</legend>
            <table className="for-text-fields">
              <tr>
                <td>Old password</td>
                <td>
                  <input type="password" name="passsword-old" />
                </td>
              </tr>
              <tr>
                <td>New password</td>
                <td>
                  <input type="password" name="newPassword" value={@state.newPassword} onChange={@handleStateInput} />
                </td>
              </tr>
              <tr>
                <td>Confirm new password</td>
                <td>
                  <input type="password" name="newPasswordConfirmation" value={@state.newPasswordConfirmation} ref="confirmedPassword" onChange={@handleStateInput} />
                  {if @state.newPassword and @state.newPasswordConfirmation
                    unless @state.newPassword is @state.newPasswordConfirmation
                      'These don\'t match'
                  }
                </td>
              </tr>
            </table>
          </fieldset>

          <button type="submit">Save password</button>
        </div>

        <div hash="#/edit/account/profile">
          <fieldset>
            <legend>Avatar</legend>
            <table>
              <tr>
                <td style={verticalAlign: 'middle'}>
                  <img src={@props.user.avatar} width="96" height="96" />
                </td>
                <td>
                  <label>
                    <p>Upload an image <small>(square .jpg or .png, max [[N]] KB)</small></p>
                    <p><input type="file" name="avatar" /></p>
                  </label>
                  <p>Or <button type="button" name="delete-avatar">Delete this avatar</button></p>
                </td>
              </tr>
            </table>
          </fieldset>

          <fieldset>
            <legend>Optional profile details</legend>
            <table className="for-text-fields">
              <tr>
                <th>Your name</th>
                <td>
                  <input type="text" name="real_name" value={@props.user.real_name} placeholder="John Smith" onChange={@handlePropertyInputChange} /><br />
                  <small>We’ll use this to give acknowledgement in papers, on posters, etc.</small>
                </td>
              </tr>
              <tr>
                <th>Location</th>
                <td><input type="text" name="location" value={@props.user.location} placeholder="Chicago, IL" onChange={@handlePropertyInputChange} /></td>
              </tr>
              <tr>
                <th>Public email address</th>
                <td><input type="text" name="public_email" value={@props.user.public_email} placeholder="me@example.com" onChange={@handlePropertyInputChange} /></td>
              </tr>
              <tr>
                <th>Web site</th>
                <td><input type="url" name="personal_url" value={@props.user.personal_url} placeholder="https://www.example.com/" onChange={@handlePropertyInputChange} /></td>
              </tr>
              <tr>
                <th>Twitter</th>
                <td><input type="text" name="twitter" prefix="@" value={@props.user.twitter} placeholder="Your twitter name" onChange={@handlePropertyInputChange} /></td>
              </tr>
              <tr>
                <th>Pinterest</th>
                <td><input type="text" name="pinterest" value={@props.user.pinterest} placeholder="Your Pinterest user name" onChange={@handlePropertyInputChange} /></td>
              </tr>
            </table>
          </fieldset>

          <button type="submit">Save profile</button>
        </div>
      </ChildRouter>
    </div>
