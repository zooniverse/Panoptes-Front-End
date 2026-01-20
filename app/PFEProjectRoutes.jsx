import React from 'react';
import { Route } from 'react-router';
import { createRoutesFromReactChildren } from 'react-router/lib//RouteUtils';
import PFEProjectRoute from './PFEProjectRoute';
import { PFE_SLUGS } from './monorepoUtils';

/*
  This is a very useful article explaining how to write custom Route components for react-router v3.
  https://marmelab.com/blog/2016/09/20/custom-react-router-component.html
*/
function PFEProjectRoutes() {
  return (
    <div>
      &lt;PFEProjectRoutes&gt; elements are for configuration only and should not be
      rendered
    </div>
  );
}

PFEProjectRoutes.createRouteFromReactElement = (element, parentRoute) => {
  const pfeProjectRoutes = createRoutesFromReactChildren(
    <Route path='projects'>
      {PFE_SLUGS.map(slug => <PFEProjectRoute key={slug} path={slug} />)}
      <Route path=':locale'>
        {PFE_SLUGS.map(slug => <PFEProjectRoute key={slug} path={slug} />)}
      </Route>
    </Route>,
    parentRoute
  )[0];
  pfeProjectRoutes.component = ({ children }) => (
      <>
        {children}
      </>
    );
  return pfeProjectRoutes;
};

export default PFEProjectRoutes;
