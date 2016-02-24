React = require 'react'
counterpart = require 'counterpart'
Translate = require 'react-translate-component'
{Link, IndexLink} = require 'react-router'

counterpart.registerTranslations 'en',
  bestPractices:
    title: 'Best Practices'
    nav:
      introduction: 'Introduction'
      greatProject: 'Building a Great Project'
      launchRush: 'The Launch Rush'
      theLongHaul: 'In For the Long Haul'
      resources: 'Resources and Examples'

module.exports = React.createClass
  displayName: 'LabBestPracticesNav'

  componentDidMount: ->
    document.documentElement.classList.add 'on-secondary-page'

  componentWillUnmount: ->
    document.documentElement.classList.remove 'on-secondary-page'

  render: ->
    <div className="best-practices-page secondary-page">
      <section className="hero">
        <div className="hero-container">
          <Translate content="bestPractices.title" component="h1" />
          <nav className="hero-nav">
            <IndexLink to="/lab-best-practices/introduction" activeClassName="active">
              <Translate content="bestPractices.nav.introduction" />
            </IndexLink>

            <Link to="/lab-best-practices/great-project" activeClassName="active">
              <Translate content="bestPractices.nav.greatProject" />
            </Link>

            <Link to="/lab-best-practices/launch-rush" activeClassName="active">
              <Translate content="bestPractices.nav.launchRush" />
            </Link>

            <Link to="/lab-best-practices/the-long-haul" activeClassName="active">
              <Translate content="bestPractices.nav.theLongHaul" />
            </Link>

            <Link to="/lab-best-practices/resources" activeClassName="active">
              <Translate content="bestPractices.nav.resources" />
            </Link>
          </nav>
        </div>
      </section>
      <section className="centered-grid content-container">
        {@props.children}
      </section>
    </div>