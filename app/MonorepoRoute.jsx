import React from 'react';
import { Route } from 'react-router';
import { createRoutesFromReactChildren } from 'react-router/lib//RouteUtils';

/*
 Used to force a refresh on entering a route, causing it to be fetched from
 the server - and allowing us to reverse proxy other apps to routes in PFE.

 Usage: <Route path="path/to/location" component={RELOAD} />
*/
function RELOAD({ newUrl }) {
  if (window.location.hostname === 'www.zooniverse.org') {
    window.location.reload();
  } else {
    window.location = newUrl;
  }

  // we should never get here.
  return (
    <div>
      Loading…
    </div>
  );
}

/*
  This is a very useful article explaining how to write custom Route components for react-router v3.
  https://marmelab.com/blog/2016/09/20/custom-react-router-component.html
*/
function MonorepoRoute() {
  return (
    <div>
      &lt;MonorepoRoute&gt; elements are for configuration only and should not be
      rendered
    </div>
  );
}

MonorepoRoute.createRouteFromReactElement = (element, parentRoute) => {
  const { path } = element.props;

  function Reload() {
    return <RELOAD newUrl={`https://fe-project.zooniverse.org/${path}`} />;
  }
  const monorepoRoute = createRoutesFromReactChildren(<Route path={path} />, parentRoute)[0];
  monorepoRoute.component = Reload;
  return monorepoRoute;
};

export default MonorepoRoute;
