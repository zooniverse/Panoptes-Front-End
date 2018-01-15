React = require 'react'
createReactClass = require 'create-react-class'
counterpart = require 'counterpart'
Translate = require 'react-translate-component'
{ Helmet } = require 'react-helmet'
ChangeListener = require '../../components/change-listener'
{Link, IndexLink} = require 'react-router'

counterpart.registerTranslations 'en',
  userSettingsPage:
    title: "Settings"
    nav:
      accountInformation: "Account Information"
      customizeProfile: "Customize Profile"
      email: "Email"

UserSettingsPage = createReactClass
  displayName: 'UserSettingsPage'

  getInitialState: ->
    activeTab: "account-information"

  render: ->
    <section className="user-profile-content">
      <Helmet title="#{counterpart 'userSettingsPage.title'} » #{@props.user.display_name}" />
      <div className="secondary-page settings-page">
        <h2><Translate content="userSettingsPage.title" /></h2>
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

module.exports = createReactClass
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
