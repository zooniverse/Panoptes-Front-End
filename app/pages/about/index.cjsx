counterpart = require 'counterpart'
React = require 'react'
Translate = require 'react-translate-component'
{Link, IndexLink} = require 'react-router'

counterpart.registerTranslations 'en',
  about:
    title: 'About Us'
    nav:
      about: 'About'
      publications: 'Publications'
      ourTeam: 'Our Team'
      education: 'Education'
      careers: 'Careers'
      volunteering: 'Volunteering'
      contact: 'Contact Us'

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
      <section className="hero about-hero">
        <div className="hero-container">
          <Translate content="about.title" component="h1" />
          <nav className="hero-nav">
            <IndexLink to="/about" activeClassName="active"><Translate content="about.nav.about" /></IndexLink>
            <Link to="/about/publications" activeClassName="active" onClick={@logClick?.bind(this, 'about.nav.publications')}><Translate content="about.nav.publications"/></Link>
            <Link to="/about/team" activeClassName="active" onClick={@logClick?.bind(this, 'about.nav.ourTeam')}><Translate content="about.nav.ourTeam" /></Link>
            <Link to="/about/education" activeClassName="active" onClick={@logClick?.bind(this, 'about.nav.education')}><Translate content="about.nav.education" /></Link>
            <Link to="/about/volunteering" activeClassName="active" onClick={@logClick?.bind(this, 'about.nav.volunteering')}><Translate content="about.nav.volunteering" /></Link>
            <Link to="/about/contact" activeClassName="active" onClick={@logClick?.bind(this, 'about.nav.contact')}><Translate content="about.nav.contact" /></Link>
          </nav>
        </div>
      </section>
      <section className="about-page-content content-container">
        {@props.children}
      </section>
    </div>
