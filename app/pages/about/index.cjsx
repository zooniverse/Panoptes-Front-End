counterpart = require 'counterpart'
React = require 'react'
Translate = require 'react-translate-component'
{Link} = require 'react-router'
{RouteHandler} = require 'react-router'
Markdown = require '../../components/markdown'

counterpart.registerTranslations 'en',
  about:
    title: 'About Us'
    nav:
      about: 'About'
      publications: 'Publications'
      ourTeam: 'Our Team'
      careers: 'Careers'
      contact: 'Contact Us'

module.exports = React.createClass
  displayName: 'AboutPage'

  componentDidMount: ->
    document.documentElement.classList.add 'on-secondary-page'

  componentWillUnmount: ->
    document.documentElement.classList.remove 'on-secondary-page'

  render: ->
    <div className="secondary-page about-page">
      <section className="hero about-hero">
        <div className="hero-container">
          <Translate content="about.title" component="h1" />
          <nav className="hero-nav">
            <Link to="about-home"><Translate content="about.nav.about" /></Link>
            <Link to="about-publications"><Translate content="about.nav.publications" /></Link>
            <Link to="about-team"><Translate content="about.nav.ourTeam" /></Link>
            <Link to="about-contact"><Translate content="about.nav.contact" /></Link>
          </nav>
        </div>
      </section>
      <section className="about-page-content content-container">
        <RouteHandler />
      </section>
    </div>