counterpart = require 'counterpart'
React = require 'react'
Translate = require 'react-translate-component'
{ Helmet } = require 'react-helmet'
{Link, IndexLink} = require 'react-router'

counterpart.registerTranslations 'en',
  about:
    title: 'About Us'
    nav:
      about: 'About'
      publications: 'Publications'
      ourTeam: 'Our Team'
      acknowledgements: 'Acknowledgements'
      contact: 'Contact Us'
      faq: 'FAQ'

module.exports = React.createClass
  displayName: 'AboutPage'

  contextTypes:
    geordi: React.PropTypes.object

  componentWillReceiveProps: (nextProps, nextContext)->
    @logClick = nextContext?.geordi?.makeHandler? 'about-menu'

  componentDidMount: ->
    document.documentElement.classList.add 'on-secondary-page'

  componentWillUnmount: ->
    document.documentElement.classList.remove 'on-secondary-page'

  render: ->
    <div className="secondary-page about-page">
      <Helmet title="About" />
      <section className="hero">
        <div className="hero-container">
          <Translate content="about.title" component="h1" />
          <nav className="hero-nav">
            <IndexLink to="/about" activeClassName="active"><Translate content="about.nav.about" /></IndexLink>
            <Link to="/about/publications" activeClassName="active" onClick={@logClick?.bind(this, 'about.nav.publications')}><Translate content="about.nav.publications"/></Link>
            <Link to="/about/team" activeClassName="active" onClick={@logClick?.bind(this, 'about.nav.ourTeam')}><Translate content="about.nav.ourTeam" /></Link>
            <Link to="/about/acknowledgements" activeClassName="active" onClick={@logClick?.bind(this, 'about.nav.acknowledgements')}><Translate content="about.nav.acknowledgements" /></Link>
            <Link to="/about/contact" activeClassName="active" onClick={@logClick?.bind(this, '
              about.nav.contact')}><Translate content="about.nav.contact" /></Link>
            <Link to="/about/faq" activeClassName="active" onClick={@logClick?.bind(this, 'about.nav.faq')}><Translate content="about.nav.faq" /></Link>
          </nav>
        </div>
      </section>
      <section className="about-page-content content-container">
        {@props.children}
      </section>
    </div>
