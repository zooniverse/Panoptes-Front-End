React = require 'react'
counterpart = require 'counterpart'
Translate = require 'react-translate-component'
ChangeListener = require '../components/change-listener'
{IndexLink, Link} = require 'react-router'

counterpart.registerTranslations 'en',
  userAdminPage:
    header: "Admin"
    nav:
      createAdmin: "Manage Users"
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
              <IndexLink to="/admin"
                type="button"
                className="secret-button admin-button"
                activeClassName="active">
                <Translate content="userAdminPage.nav.createAdmin" />
              </IndexLink>
              <Link to="/admin/project_status"
                type="button"
                className="secret-button admin-button"
                activeClassName="active">
                <Translate content="userAdminPage.nav.projectStatus" />
              </Link>
            </nav>
          </aside>
          <section className="admin-tab-content">
            {React.cloneElement @props.children, @props}
          </section>
        </div>
      </div>
    </section>

module.exports = React.createClass
  displayName: 'AdminPageWrapper'

  render: ->
    <div>
      {if @props.user?
        <ChangeListener target={@props.user}>{ =>
          if @props.user.admin
            <AdminPage {...@props} />
          else
            <div className="content-container">
              <p>You are not an administrator</p>
            </div>
        }</ChangeListener>
      else
        <div className="content-container">
          <p>You’re not signed in.</p>
        </div>}
    </div>
