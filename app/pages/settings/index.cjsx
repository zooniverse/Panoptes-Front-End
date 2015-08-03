React = require 'react'
counterpart = require 'counterpart'
Translate = require 'react-translate-component'
ChangeListener = require '../../components/change-listener'
{Link, RouteHandler} = require 'react-router'

counterpart.registerTranslations 'en',
  userSettingsPage:
    header: "Settings"
    nav:
      accountInformation: "Account Information"
      customizeProfile: "Customize Profile"
      email: "Email"

UserSettingsPage = React.createClass
  displayName: 'UserSettingsPage'

  getInitialState: ->
    activeTab: "account-information"

  render: ->
    <section className="user-profile-content">
      <div className="secondary-page settings-page">
        <h2><Translate content="userSettingsPage.header" /></h2>
        <div className="settings-content">
          <aside className="secondary-page-side-bar settings-side-bar">
            <nav>
              <Link to="settings"
                type="button"
                className="secret-button settings-button" >
                <Translate content="userSettingsPage.nav.accountInformation" />
              </Link>
              <Link to="profile-settings"
                type="button"
                className="secret-button settings-button" >
                <Translate content="userSettingsPage.nav.customizeProfile" />
              </Link>
              <Link to="email-settings"
                type="button"
                className="secret-button settings-button" >
                <Translate content="userSettingsPage.nav.email" />
              </Link>
            </nav>
          </aside>
          <section className="settings-tab-content">
            <RouteHandler user={@props.user} />
          </section>
        </div>
      </div>
    </section>

module.exports = React.createClass
  displayName: 'UserSettingsPageWrapper'

  render: ->
    <div>
      {if @props.user?
        <ChangeListener target={@props.user}>{ =>
          <UserSettingsPage user={@props.user} />
        }</ChangeListener>
      else
        <div className="content-container">
          <p>You’re not signed in.</p>
        </div>}
    </div>
