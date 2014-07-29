React = require 'react'
Translator = require 'react-translator'
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
      <a href="#/" className="main-header-item logo">
        <ZooniverseLogo />
        &nbsp;
        <Translator>nav.home</Translator>
      </a>
      <a href="#/projects" className="main-header-item"><Translator>nav.projects</Translator></a>
      <a href="#/about" className="main-header-item"><Translator>nav.about</Translator></a>
    </nav>
