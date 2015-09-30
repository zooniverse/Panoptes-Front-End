React = require 'react'
counterpart = require 'counterpart'
Translate = require 'react-translate-component'
ChangeListener = require '../components/change-listener'
{Link, RouteHandler} = require '@edpaget/react-router'

counterpart.registerTranslations 'en',
  userAdminPage:
    header: "Admin"
    nav:
      createAdmin: "Manage Administrators"
      projectStatus: "Set Project Status"

AdminPage = React.createClass
  displayName: 'AdminPage'

  render: ->
    <section className="admin-page-content">
      <div className="secondary-page admin-page">
        <h2><Translate content="userAdminPage.header" /></h2>
        <div className="admin-content">
          <aside className="secondary-page-side-bar admin-side-bar">
            <nav>
              <Link to="admin"
                type="button"
                className="secret-button admin-button" >
                <Translate content="userAdminPage.nav.createAdmin" />
              </Link>
              <Link to="admin-project-list"
                type="button"
                className="secret-button admin-button" >
                <Translate content="userAdminPage.nav.projectStatus" />
              </Link>
            </nav>
          </aside>
          <section className="admin-tab-content">
            <RouteHandler user={@props.user} />
          </section>
        </div>
      </div>
    </section>

module.exports = React.createClass
  displayName: 'AdminPageWrapper'

  render: ->
    <div>
      <ChangeListener target={@props.user}>{ =>
        if @props.user?
          if @props.user.admin?
            <AdminPage />
          else
            <div className="content-container">
              <p>You're not an administrator</p>
            </div>
        else
          <div className="content-container">
            <p>You’re not signed in.</p>
          </div>
      }</ChangeListener>
    </div>
