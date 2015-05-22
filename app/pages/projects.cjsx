counterpart = require 'counterpart'
React = require 'react'
TitleMixin = require '../lib/title-mixin'
Translate = require 'react-translate-component'
apiClient = require '../api/client'
PromiseRenderer = require '../components/promise-renderer'
ProjectCard = require '../partials/project-card'
{Link} = require 'react-router'

counterpart.registerTranslations 'en',
  projectsPage:
    title: 'All Projects'
    countMessage: 'Showing %(count)s found'

module.exports = React.createClass
  displayName: 'ProjectsPage'

  mixins: [TitleMixin]

  title: 'Projects'

  componentDidMount: ->
    document.documentElement.classList.add 'on-all-projects-page'

  componentWillUnmount: ->
    document.documentElement.classList.remove 'on-all-projects-page'

  render: ->
    <div className="all-projects-page">
      <section className="projects-hero">
        <Translate component="h1" content="projectsPage.title" />
      </section>
      <section className="projects-container">
        <PromiseRenderer promise={apiClient.type('projects').get(@props.query ? {})}>{(projects) =>
          if projects?
            if projects.length is 0
              <span>No projects found.</span>
            else
              <div>
                <div className="project-results-counter">
                  <Translate count={projects.length} content="projectsPage.countMessage" component="p" />
                </div>
                <div className="project-card-list">
                  {if projects?
                    for project in projects
                      <ProjectCard key={project.id} project={project} />}
                </div>
                <nav>
                  {meta = projects[0].getMeta()
                  if meta?
                    <nav className="pagination">
                      {for page in [1..meta.page_count]
                        <Link to="projects" query={{page}} key={page} className="pill-button">{page}</Link>}
                    </nav>}
                </nav>
              </div>
          else
            <div>Loading projects</div>
        }</PromiseRenderer>
      </section>
    </div>
