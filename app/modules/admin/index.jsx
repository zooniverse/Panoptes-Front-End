import React from 'react';
import Router, { IndexRoute, IndexRedirect, Route } from 'react-router';

import AdminContainer from './containers/admin-container';
import ManageUserContainer from './containers/manage-user-container';
// import ProjectStatusList from './pages/admin/project-status-list';
// import ProjectStatus from './pages/admin/project-status';

function routeExporter() {
  return (
    <Route path="admin" component={AdminContainer}>
      <IndexRedirect to="manage-user" />
      <Route path="manage-user" component={ManageUserContainer} />
    </Route>
  );
}

export default routeExporter;
