# @cjsx React.DOM

React = require 'react'
ChildRouter = require 'react-child-router'

module.exports = React.createClass
  displayName: 'EditAccountPage'

  handleInputChange: (e) ->
    property = 'value'
    if e.target.type in ['radio', 'checkbox']
      property = 'checked'

    @props.user[e.target.name] = e.target[property]

  render: ->
    <div className="edit-account-page tabbed-content" data-side="left" style={padding: '1vh 1vw'}>
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

      <ChildRouter className="tabbed-content-content">
        <div hash="#/edit/account">
          <form method="put" onSubmit={(e) -> e.preventDefault(); @props.user.save 'email', 'wants_betas', 'can_survey'}>
            <fieldset>
              <legend>Contact info</legend>
              <p>Email address</p>
              <input type="email" name="email" value={@props.user.email} placeholder="me@example.com" size="50", onChange={@handleInputChange} />
              <p><small>We’ll never share this address. You can edit your public contact information in your profile</small></p>
            </fieldset>

            <fieldset>
              <legend>Contact preferences</legend>
              <table className="for-checkboxes">
                <tr>
                  <td>
                    <input type="checkbox" name="wants_betas" checked={@props.user.wants_betas} onChange={@handleInputChange} />
                  </td>
                  <td>
                    <label>I want to help test new projects under development.</label>
                  </td>
                </tr>
                <tr>
                  <td>
                    <input type="checkbox" name="can_survey" checked={@props.user.can_survey} onChange={@handleInputChange} />
                  </td>
                  <td>
                    <label>I’m willing to take part in occasional surveys from the Zooniverse and associated scientists.</label>
                  </td>
                </tr>
              </table>

              <button type="submit">Save account settings</button>
            </fieldset>
          </form>
        </div>

        <div hash="#/edit/account/password">
          <fieldset>
            <legend>Change your password</legend>
            <table className="for-text-fields">
              <tr>
                <td>Old password</td>
                <td>
                  <input type="password" name="passsword-old" size="50" />
                </td>
              </tr>
              <tr>
                <td>New password</td>
                <td>
                  <input type="password" name="passsword-new" size="50" />
                </td>
              </tr>
              <tr>
                <td>Confirm new password</td>
                <td>
                  <input type="password" name="passsword-confirmed" size="50" />
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
                  <img src={@props.user.avatar} width="96", height="96" />
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
            <table>
              <tr>
                <td><label>Your name</label></td>
                <td>
                  <input type="text" name="real-name" placeholder="John Smith" size="50" />
                  <p><small>We’ll use this to give acknowledgement in papers, on posters, etc.</small></p>
                </td>
              </tr>
              <tr>
                <td><label>Location</label></td>
                <td><input type="text" name="location" placeholder="Chicago, IL" size="50" /></td>
              </tr>
              <tr>
                <td><label>Public email address</label></td>
                <td><input type="text" name="public-email" placeholder="me@example.com" size="50" /></td>
              </tr>
              <tr>
                <td><label>Web site</label></td>
                <td><input type="personal_url" name="www" placeholder="https://www.example.com/" size="50" /></td>
              </tr>
            </table>
          </fieldset>

          <fieldset>
            <legend>Social media</legend>
            <table>
              <tr>
                <td>Twitter</td>
                <td><input type="text" name="twitter" placeholder="Your Twitter handle" /></td>
              </tr>
              <tr>
                <td>Pinterest</td>
                <td><input type="text" name="pinterest" placeholder="Your Pinterest user name" /></td>
              </tr>
            </table>
          </fieldset>

          <button type="submit">Save profile</button>
        </div>
      </ChildRouter>
    </div>
