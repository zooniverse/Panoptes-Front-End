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
      title: 'People-Powered Science'
      tagline: 'The Zooniverse is a platform for citizen science and an opportunity for anyone to contribute to science.'
      button: 'Get started!'

module.exports = React.createClass
  displayName: 'HomePage'

  getInitialState: ->
    featuredProjectsIds: {dev: ['231', '405', '272', '166'], production: []}

  componentDidMount: ->
    document.addEventListener 'scroll', @onScroll
    document.documentElement.classList.add 'on-home-page'

  componentWillUnmount: ->
    document.documentElement.classList.remove 'on-home-page'
    document.removeEventListener 'scroll', @onScroll

  render: ->
    featuredProjects = @getFeaturedProjects()

    <div className="home-page">
      <section className="hero on-dark">
        <img src="./assets/zooniverse-logotype.png" alt="Zooniverse" />
        <h3 className="hero-title"><Translate content="home.hero.title" /></h3>
        <p className="hero-tagline"><Translate content="home.hero.tagline" /></p>
        <Link to="projects" className="call-to-action standard-button hero-button x-large"><Translate content="home.hero.button" /></Link>
      </section>
      <section className="featured-projects">
        <div className="floating-container" ref="floatingContainer">
          <PromiseRenderer promise={apiClient.type('projects').get(featuredProjects)}>{(projects) =>
            if projects?
              <div className="featured-projects-list content-container">
              {for project in projects
                <ProjectCard key={project.id} project={project} />
              }
              </div>
          }</PromiseRenderer>
        </div>
      </section>
    </div>

  getFeaturedProjects: ->
    # This will be changed later to look for launched_approved boolean set to true or use a set of hardcoded IDs when in production
    appState = if window.location.hostname isnt 'www.zooniverse.org' then 'dev' else 'production'
    @state.featuredProjectsIds[appState]

  showLoginDialog: (which) ->
    alert (resolve) ->
      <LoginDialog which={which} onSuccess={resolve} />

  onScroll: (e) ->
    floatingContainer = React.findDOMNode(@refs.floatingContainer)

    #Stick or unstick floating container of featured projects
    if window.scrollY + window.innerHeight >= 1200
      floatingContainer.classList.add 'featured-projects-sticky'
    else
      floatingContainer.classList.remove 'featured-projects-sticky'
