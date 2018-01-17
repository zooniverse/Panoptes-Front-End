import PropTypes from 'prop-types';
import React from 'react';
import counterpart from 'counterpart';
import Translate from 'react-translate-component';
import { IndexLink, Link } from 'react-router';
import { Helmet } from 'react-helmet';

const AdminPage = ({ user, children }) => {
  if (!user) {
    return (
      <div className="content-container">
        <Translate component="p" content="userAdminPage.notSignedInMessage" />
      </div>
    );
  }

  if (user.admin) {
    return (
      <section className="admin-page-content">
        <Helmet title={counterpart('userAdminPage.header')} />
        <div className="secondary-page admin-page">
          <Translate component="h2" content="userAdminPage.header" />
          <div className="admin-content">
            <aside className="secondary-page-side-bar admin-side-bar">
              <nav>
                <IndexLink
                  to="/admin"
                  type="button"
                  className="secret-button admin-button"
                  activeClassName="active"
                >
                  <Translate content="userAdminPage.nav.createAdmin" />
                </IndexLink>
                <Link
                  to="/admin/project_status"
                  type="button"
                  className="secret-button admin-button"
                  activeClassName="active"
                >
                  <Translate content="userAdminPage.nav.projectStatus" />
                </Link>
                <Link
                  to="/admin/grantbot"
                  type="button"
                  className="secret-button admin-button"
                  activeClassName="active"
                >
                  <Translate content="userAdminPage.nav.grantbot" />
                </Link>
                <Link
                  to="/admin/organization-status"
                  type="button"
                  className="secret-button admin-button"
                  activeClassName="active"
                >
                  <Translate content="userAdminPage.nav.organizationStatus" />
                </Link>
              </nav>
            </aside>
            <section className="admin-tab-content">
              {React.cloneElement(children, { user, children })}
            </section>
          </div>
        </div>
      </section>
    );
  }

  return (
    <div className="content-container">
      <Translate component="p" content="userAdminPage.notAdminMessage" />
    </div>
  );
};

AdminPage.defaultProps = {
  children: null,
  user: null
};

AdminPage.propTypes = {
  children: PropTypes.node,
  user: PropTypes.shape({
    admin: PropTypes.bool
  })
};

export default AdminPage;