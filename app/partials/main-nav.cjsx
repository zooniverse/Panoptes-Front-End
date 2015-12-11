counterpart = require 'counterpart'
React = require 'react'
Translate = require 'react-translate-component'
{Index, Link} = require 'react-router'
ZooniverseLogo = require './zooniverse-logo'

counterpart.registerTranslations 'en',
  nav:
    home: 'Zooniverse'
    projects: 'Projects'
    about: 'About'

module.exports = React.createClass
  displayName: 'MainNav'

  render: ->
    <nav className="main-nav main-header-group">
      <IndexLink to="/" className="main-header-item logo">
        <ZooniverseLogo />&nbsp;<Translate content="nav.home" />
      </IndexLink>
      <Link to="/projects" className="main-header-item"><Translate content="nav.projects" /></Link>
    </nav>
