import React from 'react';
import Router, { IndexRoute, IndexRedirect, Route, Redirect } from 'react-router';

import AdminContainer from './containers/admin-container';
// import UserSettingsList from './pages/admin/user-settings-list';
// import ProjectStatusList from './pages/admin/project-status-list';
// import ProjectStatus from './pages/admin/project-status';

function routeExporter() {
  return (
    <Route path="admin" component={AdminContainer}>
    </Route>
  );
}

export default routeExporter;
