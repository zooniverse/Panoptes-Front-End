React = require 'react'
Translator = require 'react-translator'

{nav, a, span} = React.DOM

Translator.setStrings
  nav:
    home: 'Zooniverse'
    projects: 'Projects'
    about: 'About'

module.exports = React.createClass
  displayName: 'MainNav'

  render: ->
    nav className: 'main-nav main-header-group',
      a href: '#/', className: 'main-header-item logo',
        span className: 'zooniverse-logo', 'Ø'
        Translator null, 'nav.home'
      a href: '#/projects', className: 'main-header-item', Translator null, 'nav.projects'
      a href: '#/about', className: 'main-header-item', Translator null, 'nav.about'
