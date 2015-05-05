counterpart = require 'counterpart'
React = require 'react'
Translate = require 'react-translate-component'
{Link} = require 'react-router'

apiClient = require '../api/client'
PromiseRenderer = require '../components/promise-renderer'
ProjectClassifyPage = require './project/classify'
ProjectCard = require '../partials/project-card'
alert = require '../lib/alert'
LoginDialog = require '../partials/login-dialog'

counterpart.registerTranslations 'en',
  home:
    hero:
      title: 'Welcome'
      intro: 'A tagline about the Zooniverse.'
      button: 'Get started!'
    stats:
      loading: 'Loading Stats'
      project: 'Project'
      subjects: 'subjects'
      classifications: 'classifications'
    try:
      header: 'Want to make your own project?'
      button: 'Create an account'

module.exports = React.createClass
  displayName: 'HomePage'

  getInitialState: ->
    featuredProjectsIds: ['396', '405', '272', '166']

  render: ->
    randomFeatured = @getFeaturedProject()

    <div className="home-page">
      <section className="hero">
        <Translate component="h1" content="home.hero.title" />
        <Translate component="p" content="home.hero.intro" />
        <Link to="projects" className="call-to-action standard-button"><Translate content="home.hero.button" /></Link>
      </section>
      <PromiseRenderer promise={apiClient.type('projects').get(randomFeatured)}>{(project) =>
        <section className="featured-project">
            {if project?
              <div>
                <div className="secondary-row featured-project-stats">
                  <h3><Translate component="span" content="home.stats.project" /><span>{" " + project.display_name}</span></h3>
                  <p><span>{project.subjects_count + " "}</span><Translate component="span" content="home.stats.subjects" /></p>
                  <p><span>{project.classifications_count + " "}</span><Translate component="span" content="home.stats.classifications" /></p>
                </div>
                <div className="featured-project-classifier">
                  <ProjectClassifyPage project={project} />
                </div>
              </div>
            }
        </section>
      }</PromiseRenderer>
      <PromiseRenderer promise={apiClient.type('projects').get('?launched_approved=true')}>{(projects) =>
        <section>
          {if projects?
            for project in projects
              <ProjectCard key={project.id} project={project} />
          }
        </section>
      }</PromiseRenderer>
      <section className="secondary-row call-to-try">
        <Translate component="h3" content="home.try.header" />
        <button type="button" className="call-to-action standard-button" onClick={@showLoginDialog.bind this, 'register'}>
          <Translate content="home.try.button" />
        </button>
      </section>
    </div>

  getFeaturedProject: ->
    @state.featuredProjectsIds[Math.floor(Math.random()*@state.featuredProjectsIds.length)]

  showLoginDialog: (which) ->
    alert (resolve) ->
      <LoginDialog which={which} onSuccess={resolve} />
