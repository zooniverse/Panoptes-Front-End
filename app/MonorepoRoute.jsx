import React from 'react';
import { IndexRoute, Route } from 'react-router';
import { createRoutesFromReactChildren } from 'react-router/lib//RouteUtils';

function redirectProjectPage(nextState, replace, done) {
  try {
    const { pathname } = nextState.location;
    let newUrl = `https://fe-project.zooniverse.org${pathname}`;
    if (window.location.hostname === 'www.zooniverse.org') {
      newUrl = `https://www.zooniverse.org${pathname}`;
    }
    window.location.replace(newUrl);
    done();
  } catch (error) {
    done(error);
  }
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
      <IndexRoute onEnter={redirectProjectPage} />
      <Route path="classify" onEnter={redirectProjectPage} />
      <Route path="about" onEnter={redirectProjectPage} />
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
