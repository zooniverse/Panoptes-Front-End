React = require 'react'
Translator = require 'react-translator'
{Link} = require 'react-router'
ZooniverseLogo = require './zooniverse-logo'

Translator.setStrings
  nav:
    home: 'Zooniverse'
    projects: 'Projects'
    about: 'About'

module.exports = React.createClass
  displayName: 'MainNav'

  render: ->
    <nav className="main-nav main-header-group">
      <Link to="home" className="main-header-item logo">
        <ZooniverseLogo />&nbsp;<Translator>nav.home</Translator>
      </Link>
      <Link to="projects" className="main-header-item"><Translator>nav.projects</Translator></Link>
    </nav>
