React = require 'react'
Translator = require 'react-translator'
Link = require '../lib/link'
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
      <Link href="/" root={true} className="main-header-item logo">
        <ZooniverseLogo />
        &nbsp;
        <Translator>nav.home</Translator>
      </Link>
      <Link href="/projects" className="main-header-item"><Translator>nav.projects</Translator></Link>
      <Link href="/about" className="main-header-item"><Translator>nav.about</Translator></Link>
    </nav>
