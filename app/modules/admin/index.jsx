import React from 'react';
import Router, { IndexRoute, IndexRedirect, Route } from 'react-router';

import AdminContainer from './containers/admin-container';
import ManageUserContainer from './containers/manage-user-container';
import ProjectStatusList from './containers/project-status-list-container';
import ProjectStatus from './containers/project-status-container';

function routeExporter() {
  return (
    <Route path="admin" component={AdminContainer}>
      <IndexRedirect to="manage-user" />
      <Route path="manage-user" component={ManageUserContainer} />
      <Route path="project_status" component={ProjectStatusList} />
      <Route path="project_status/:owner/:name" component={ProjectStatus} />
    </Route>
  );
}

export default routeExporter;
