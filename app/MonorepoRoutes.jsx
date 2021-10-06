import React from 'react';
import { Route } from 'react-router';
import { createRoutesFromReactChildren } from 'react-router/lib//RouteUtils';
import MonorepoRoute from './MonorepoRoute';

/*
  Edit this list to add new project slugs.
*/
const SLUGS = [
  "nora-dot-eisner/planet-hunters-tess",
  "adamamiller/zwickys-stellar-sleuths",
  "msalmon/hms-nhs-the-nautical-health-service",
  "blicksam/transcription-task-testing",
  "humphrydavy/davy-notebooks-project",
  "mainehistory/beyond-borders-transcribing-historic-maine-land-documents",
  "zookeeper/galaxy-zoo-weird-and-wonderful",
  "hughdickinson/superwasp-black-hole-hunters",
  "bogden/scarlets-and-blues",
  "kmc35/peoples-contest-digital-archive",
  "rachaelsking/corresponding-with-quakers",
  "mariaedgeworthletters/maria-edgeworth-letters"
]
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
