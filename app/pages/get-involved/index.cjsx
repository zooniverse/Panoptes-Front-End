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
      callForProjects: 'Call for Projects'
      collections: 'Collections'
      favorites: 'Favorites'

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
    <div className="secondary-page get-involved-page">
      <section className="hero">
        <div className="hero-container">
          <Translate content="getInvolved.title" component="h1" />
          <nav className="hero-nav">
            <IndexLink to="/get-involved" activeClassName="active"><Translate content="getInvolved.nav.volunteering" /></IndexLink>
            <Link to="/get-involved/education" activeClassName="active" onClick={@logClick?.bind(this, 'getInvolved.nav.education')}><Translate content="getInvolved.nav.education" /></Link>
            <Link to="/get-involved/callForProjects" activeClassName="active" onClick={@logClick?.bind(this, 'getInvolved.nav.callForProjects')}><Translate content="getInvolved.nav.callForProjects" /></Link>
            <Link to="/get-involved/CollectionsList" activeClassname="active" onClick={@logClick?.bind(this, 'getInvolved.nav.collections-list')}><Translate content="getInvolved.nav.collections" /></Link>
            <Link to="/get-involved/FavoritesList" activeClassname="active" onClick={@logClick?.bind(this, 'getInvolved.nav.favorites-list')}><Translate content="getInvolved.nav.favorites" /></Link>
          </nav>
        </div>
      </section>
      <section className="get-involved-page-content content-container">
        {@props.children}
      </section>
    </div>
