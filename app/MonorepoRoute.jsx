import React from 'react';
import { IndexRoute, Route } from 'react-router';
import { createRoutesFromReactChildren } from 'react-router/lib//RouteUtils';

/*
 Used to force a refresh on entering a route, causing it to be fetched from
 the server - and allowing us to reverse proxy other apps to routes in PFE.

 Usage: <Route path="path/to/location" component={RELOAD} />
*/
function RELOAD({ path }) {
  let newUrl = `https://fe-project.zooniverse.org${path}`;
  if (window.location.hostname === 'www.zooniverse.org') {
    newUrl = `https://www.zooniverse.org${path}`;
  }
  window.location.replace(newUrl)

  return null;
}

function withReload(path) {
  return () => <RELOAD path={path} />;
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

  const monorepoRoute = createRoutesFromReactChildren(
    <Route path={path}>
      <IndexRoute component={withReload(path)} />
      <Route path="classify" component={withReload(`${path}/classify`)} />
      <Route path="about" component={withReload(`${path}/about`)} />
    </Route>,
    parentRoute
  )[0];
  monorepoRoute.component = ({ children }) => (
      <div>
        Loading…
        {React.Children.map(children, child =>
          React.cloneElement(child, { path })
        )}
      </div>
    );
  return monorepoRoute;
};

export default MonorepoRoute;
