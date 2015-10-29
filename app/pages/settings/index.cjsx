React = require 'react'
counterpart = require 'counterpart'
Translate = require 'react-translate-component'
ChangeListener = require '../../components/change-listener'
{Link, IndexLink} = require 'react-router'

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
              <IndexLink to="/settings"
                type="button"
                activeClassName="active"
                className="secret-button settings-button" >
                <Translate content="userSettingsPage.nav.accountInformation" />
              </IndexLink>
              <Link to="/settings/profile"
                type="button"
                activeClassName="active"
                className="secret-button settings-button" >
                <Translate content="userSettingsPage.nav.customizeProfile" />
              </Link>
              <Link to="/settings/email"
                type="button"
                activeClassName="active"
                className="secret-button settings-button" >
                <Translate content="userSettingsPage.nav.email" />
              </Link>
            </nav>
          </aside>
          <section className="settings-tab-content">
            {React.cloneElement @props.children, @props}
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
          <UserSettingsPage {...@props} user={@props.user} />
        }</ChangeListener>
      else
        <div className="content-container">
          <p>You’re not signed in.</p>
        </div>}
    </div>
