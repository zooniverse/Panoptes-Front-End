counterpart = require 'counterpart'
React = require 'react'
Translate = require 'react-translate-component'
{Link} = require 'react-router'

counterpart.registerTranslations 'en',
  about:
    title: 'About Us'
    nav:
      about: 'About'
      publications: 'Publications'
      ourTeam: 'Our Team'
      careers: 'Careers'
    pageContent:
      about: 'some stuff about us'
      aboutTeam: 'the team!'

AboutPageContent = React.createClass
  displayName: 'AboutPageContent'

  render: ->
    activeTab = @props.activeTab
    <div className="about-page-content">
      <Translate content="about.pageContent.#{activeTab}" />
    </div>

module.exports = React.createClass
  displayName: 'AboutPage'

  getInitialState: ->
    activeTab: null

  componentDidMount: ->
    currentRoute = @props.routes[@props.routes.length - 1]
    @setState activeTab: currentRoute.name


  componentWillReceiveProps: (nextProps) ->
    currentRoute = nextProps.routes[nextProps.routes.length - 1]
    @setState activeTab: currentRoute.name


  # May pull out hero and nav section out into its own reusable component
  render: ->
    <div className="about-page">
      <section className="about-hero">
        <Translate content="" component="h1" />
        <nav>
          <Link to="about"><Translate content="about.nav.about" /></Link>
          <Link to="aboutTeam"><Translate content="about.nav.ourTeam" /></Link>
        </nav>
      </section>
      <AboutPageContent activeTab={@state.activeTab} />
    </div>