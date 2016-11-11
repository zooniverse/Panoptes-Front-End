counterpart = require 'counterpart'
React = require 'react'
Translate = require 'react-translate-component'
{Link, IndexLink} = require 'react-router'

counterpart.registerTranslations 'en',
  getInvolved:
    title: 'Get Involved'
    nav:
      volunteering: 'Volunteering'
      education: 'Education'
      careers: 'Careers'
      callForProjects: 'Call for Projects'
      collect: 'Collect'

module.exports = React.createClass
  displayName: 'GetInvolved'

  contextTypes:
    geordi: React.PropTypes.object

  componentWillReceiveProps: (nextProps, nextContext)->
    @logClick = nextContext?.geordi?.makeHandler? 'about-menu'

  componentDidMount: ->
    document.documentElement.classList.add 'on-secondary-page'

  componentWillUnmount: ->
    document.documentElement.classList.remove 'on-secondary-page'

  render: ->
    <div className="secondary-page get-involved">
      <section className="hero">
        <div className="hero-container">
          <Translate content="getInvolved.title" component="h1" />
          <nav className="hero-nav">
            <IndexLink to="/get-involved" activeClassName="active"><Translate content="about.nav.getInvolved" /></IndexLink>
            <Link to="/get-involved/volunteering" activeClassName="active" onClick={@logClick?.bind(this, 'getInvolved.nav.volunteering')}><Translate content="getInvolved.nav.volunteering" /></Link>
            <Link to="/get-involved/education" activeClassName="active" onClick={@logClick?.bind(this, 'getInvolved.nav.education')}><Translate content="getInvolved.nav.education" /></Link>
            <Link to="/get-involved/callForProjects" activeClassName="active" onClick={@logClick?.bind(this, 'getInvolved.nav.callForProjects')}><Translate content="getInvolved.nav.callForProjects" /></Link>
          </nav>
        </div>
      </section>
      <section className="get-involved-content content-container">
        {@props.children}
      </section>
    </div>
