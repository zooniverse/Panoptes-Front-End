counterpart = require 'counterpart'
React = require 'react'
Translate = require 'react-translate-component'
{Link} = require 'react-router'
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
      <Link to="home" className="main-header-item logo">
        <ZooniverseLogo />&nbsp;<Translate content="nav.home" />
      </Link>
      <Link to="projects" className="main-header-item"><Translate content="nav.projects" /></Link>
    </nav>
