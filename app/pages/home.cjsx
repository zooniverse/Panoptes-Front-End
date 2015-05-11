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
    featuredStats:
      project: 'Project'
      subjects: 'subjects'
      classifications: 'classifications'
    featuredList:
      title: 'Try out some of our other projects'
    try:
      title: 'Want to make your own project?'
      button: 'Create an account'

module.exports = React.createClass
  displayName: 'HomePage'

  getInitialState: ->
    featuredProjectsIds: ['231', '405', '272', '166']

  componentDidMount: ->
    document.documentElement.classList.add 'on-home-page'

  componentWillUnmount: ->
    document.documentElement.classList.remove 'on-home-page'

  render: ->
    randomFeatured = @getFeaturedProject()

    <div className="home-page">
      <section className="hero">
        <Translate component="h1" content="home.hero.title" />
        <Translate component="p" content="home.hero.intro" />
        <Link to="projects" className="call-to-action standard-button hero-button"><Translate content="home.hero.button" /></Link>
      </section>
      <PromiseRenderer promise={apiClient.type('projects').get(randomFeatured)}>{(project) =>
        <section className="featured-project">
            {if project?
              <div>
                <div className="secondary-row featured-project-stats">
                  <h3><Translate component="span" content="home.featuredStats.project" /><span>{" " + project.display_name}</span></h3>
                  <p><span>{project.subjects_count + " "}</span><Translate component="span" content="home.featuredStats.subjects" /></p>
                  <p><span>{project.classifications_count + " "}</span><Translate component="span" content="home.featuredStats.classifications" /></p>
                </div>
                <div className="featured-project-classifier">
                  <ProjectClassifyPage project={project} />
                </div>
              </div>
            }
        </section>
      }</PromiseRenderer>
      <PromiseRenderer promise={apiClient.type('projects').get(@state.featuredProjectsIds)}>{(projects) =>
        <section className="featured-projects">
          <div className="primary-row">
            <Translate component="h3" content="home.featuredList.title" />
          </div>
          {if projects?
            <div className="featured-projects-list content-container">
            {for project in projects
              <ProjectCard key={project.id} project={project} />
            }
            </div>
          }
        </section>
      }</PromiseRenderer>
      <section className="secondary-row call-to-try">
        <Translate component="h3" content="home.try.title" />
        <button type="button" className="call-to-action standard-button" onClick={@showLoginDialog.bind this, 'register'}>
          <Translate content="home.try.button" />
        </button>
      </section>
    </div>

  getFeaturedProject: ->
    # This will be changed later to look for launched_approved boolean set to true
    @state.featuredProjectsIds[Math.floor(Math.random()*@state.featuredProjectsIds.length)]

  showLoginDialog: (which) ->
    alert (resolve) ->
      <LoginDialog which={which} onSuccess={resolve} />
