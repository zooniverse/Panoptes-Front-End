counterpart = require 'counterpart'
React = require 'react'
Translate = require 'react-translate-component'
{Link} = require 'react-router'

apiClient = require '../api/client'
PromiseRenderer = require '../components/promise-renderer'
ZooniverseLogoType = require '../partials/zooniverse-logotype'
ProjectCard = require '../partials/project-card'
alert = require '../lib/alert'
LoginDialog = require '../partials/login-dialog'

counterpart.registerTranslations 'en',
  home:
    hero:
      title: 'People-Powered Research'
      tagline: 'The Zooniverse is the largest platform for real research online, and an opportunity for volunteers around the world to contribute to everything from astronomy to ancient texts, and from particle physics to penguinology.'
      button: 'Get involved now!'
    about:
      title: 'How does this work?'
      tagline: 'We use the power of the crowd to process scientific data, and that helps scientists make discoveries!'
      first:
        title: 'This is a Heading About Text'
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
          ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat.'
      second:
        title: 'This is a Heading About Text'
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
          ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat.'
      third:
        title: 'This is a Heading About Text'
        content:'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
          ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat.'
    featuredProjects:
      title: 'Get started on a project right now!'
      tagline: 'These are just a few of our projects.'
      button: 'See all projects'

module.exports = React.createClass
  displayName: 'HomePage'

  getInitialState: ->
    featuredProjectsIds: {dev: ['231', '405', '272', '76'], production: []}

  componentDidMount: ->
    document.documentElement.classList.add 'on-home-page'

  componentWillUnmount: ->
    document.documentElement.classList.remove 'on-home-page'

  render: ->
    featuredProjects = @getFeaturedProjects()

    <div className="home-page">
      <section className="hero on-dark">
        <ZooniverseLogoType />
        <h3 className="hero-title"><Translate content="home.hero.title" /></h3>
        <p className="hero-tagline"><Translate content="home.hero.tagline" /></p>
        <Link to="projects" className="call-to-action standard-button hero-button x-large"><Translate content="home.hero.button" /></Link>
      </section>
      <section className="about-zooniverse promo content-container">
        <h5 className="about-title"><Translate content="home.about.title" /></h5>
        <p className="about-tagline"><Translate content="home.about.tagline" /></p>
        <div className="about-items-list">
          <div className="about-item">
            <img className="about-image" src="./assets/about1.svg" alt="" />
            <Translate component="h6" content="home.about.first.title" />
            <Translate component="p" content="home.about.first.content" />
            <img className="plus" src="./assets/plus.svg" />
          </div>
          <div className="about-item">
            <img className="about-image" src="./assets/about2.svg" alt="" />
            <Translate component="h6" content="home.about.second.title" />
            <Translate component="p" content="home.about.second.content" />
          </div>
          <div className="about-item">
            <img className="equals" src="./assets/equals.svg" />
            <img className="about-image" src="./assets/about3.svg" alt="" />
            <Translate component="h6" content="home.about.third.title" />
            <Translate component="p" content="home.about.third.content" />
          </div>
        </div>
      </section>
      <section className="featured-projects content-container">
        <Translate component="h5" content="home.featuredProjects.title" />
        <Translate component="p" content="home.featuredProjects.tagline" />
        <PromiseRenderer promise={apiClient.type('projects').get(featuredProjects)}>{(projects) =>
          if projects?
            <div className="featured-projects-list">
            {for project in projects
              <ProjectCard key={project.id} project={project} />
            }
            </div>
        }</PromiseRenderer>
        <Link to="projects" className="call-to-action standard-button x-large"><Translate content="home.featuredProjects.button" /></Link>
      </section>

    </div>

  getFeaturedProjects: ->
    # This will be changed later to look for launched_approved boolean set to true or use a set of hardcoded IDs when in production
    appState = if window.location.hostname isnt 'www.zooniverse.org' then 'dev' else 'production'
    @state.featuredProjectsIds[appState]

  showLoginDialog: (which) ->
    alert (resolve) ->
      <LoginDialog which={which} onSuccess={resolve} />

