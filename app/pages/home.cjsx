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
    featuredStats:
      project: 'Project'
      subjects: 'subjects'
      classifications: 'classifications'
    try:
      title: 'Want to make your own project?'
      button: 'Create an account'

module.exports = React.createClass
  displayName: 'HomePage'

  getInitialState: ->
    featuredProjectsIds: ['231', '405', '272', '166']

  componentDidMount: ->
    document.addEventListener 'scroll', @onScroll
    document.documentElement.classList.add 'on-home-page'

  componentWillUnmount: ->
    document.documentElement.classList.remove 'on-home-page'
    document.removeEventListener 'scroll', @onScroll

  render: ->
    randomFeatured = @getFeaturedProject()

    <div className="home-page">
      <section className="hero on-dark">
        <img src="./assets/zooniverse-logotype.png" alt="Zooniverse" />
        <h3 className="hero-title"><Translate content="home.hero.title" /></h3>
        <p className="hero-tagline"><Translate content="home.hero.tagline" /></p>
        <Link to="projects" className="call-to-action standard-button hero-button x-large"><Translate content="home.hero.button" /></Link>
      </section>
      <section className="featured-projects">
        <div className="floating-container" ref="floatingContainer">
          <PromiseRenderer promise={apiClient.type('projects').get(@state.featuredProjectsIds)}>{(projects) =>
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

  getFeaturedProject: ->
    # This will be changed later to look for launched_approved boolean set to true
    @state.featuredProjectsIds[Math.floor(Math.random()*@state.featuredProjectsIds.length)]

  showLoginDialog: (which) ->
    alert (resolve) ->
      <LoginDialog which={which} onSuccess={resolve} />

  onScroll: (e) ->
    floatingContainer = React.findDOMNode(@refs.floatingContainer)

    if window.scrollY + window.innerHeight >= 1200
      floatingContainer.classList.add 'sticky'
    else
      floatingContainer.classList.remove 'sticky'
