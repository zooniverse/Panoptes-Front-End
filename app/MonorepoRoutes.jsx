import React from 'react';
import { Route } from 'react-router';
import { createRoutesFromReactChildren } from 'react-router/lib//RouteUtils';
import MonorepoRoute from './MonorepoRoute';
import { SLUGS } from './monorepoUtils';

/*
  This is a very useful article explaining how to write custom Route components for react-router v3.
  https://marmelab.com/blog/2016/09/20/custom-react-router-component.html
*/
function MonorepoRoutes() {
  return (
    <div>
      &lt;MonorepoRoutes&gt; elements are for configuration only and should not be
      rendered
    </div>
  );
}

MonorepoRoutes.createRouteFromReactElement = (element, parentRoute) => {
  const monorepoRoutes = createRoutesFromReactChildren(
    <Route path='projects'>
      {SLUGS.map(slug => <MonorepoRoute path={slug} />)}
      <Route path=':locale'>
        {SLUGS.map(slug => <MonorepoRoute path={slug} />)}
      </Route>
    </Route>,
    parentRoute
  )[0];
  monorepoRoutes.component = ({ children }) => (
      <>
        {children}
      </>
    );
  return monorepoRoutes;
};

export default MonorepoRoutes;
