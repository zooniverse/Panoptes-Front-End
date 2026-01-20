import React from 'react'
import { IndexRoute, IndexRedirect, Route, Redirect } from 'react-router'
import { createRoutesFromReactChildren } from 'react-router/lib//RouteUtils'
import {
  AboutProjectResearch,
  AboutProjectEducation,
  AboutProjectFAQ,
  AboutProjectResults
} from './pages/project/about/simple-pages'
import AboutProject from './pages/project/about/index'
import AboutProjectTeam from './pages/project/about/team'
import ProjectHomePage from './pages/project/home'
import ProjectPageController from './pages/project/index'
import ProjectClassifyPage from './pages/project/classify'

// <Redirect from="home" to="/" /> doesn't work.
class ONE_UP_REDIRECT extends React.Component {
  componentDidMount() {
    let givenPathSegments = this.props.location.pathname.split('/')
    givenPathSegments.pop()
    const pathOneLevelUp = givenPathSegments.join('/')
    this.props.router.replace(pathOneLevelUp, this.props.location.query)
  }

  render() {
    return null
  }
}

function PFEProjectRoute() {
  return (
    <div>
      &lt;PFEProjectRoute&gt; elements are for configuration only and should not
      be rendered
    </div>
  )
}

PFEProjectRoute.createRouteFromReactElement = (element, parentRoute) => {
  const { path } = element.props

  const pfeProjectRoute = createRoutesFromReactChildren(
    <Route path={path}>
      <IndexRoute component={ProjectHomePage} />
      <Route path='home' component={ONE_UP_REDIRECT} />
      <Route path='classify' component={ProjectClassifyPage} />
      <Redirect from='research' to='about/research' />
      <Redirect from='results' to='about/results' />
      <Redirect from='faq' to='about/faq' />
      <Redirect from='education' to='about/education' />
      <Route path='about' component={AboutProject}>
        <IndexRedirect to='research' />
        <Route path='research' component={AboutProjectResearch} />
        <Route path='results' component={AboutProjectResults} />
        <Route path='faq' component={AboutProjectFAQ} />
        <Route path='education' component={AboutProjectEducation} />
        <Route path='team' component={AboutProjectTeam} />
      </Route>
    </Route>,
    parentRoute
  )[0]
  pfeProjectRoute.component = props => {
    return (
      <ProjectPageController>
        Loading…
        {React.Children.map(props.children, child =>
          React.cloneElement(child, { path })
        )}
      </ProjectPageController>
    )
  }
  return pfeProjectRoute
}

export default PFEProjectRoute
