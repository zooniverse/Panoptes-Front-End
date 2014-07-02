React = require 'react'
{Link} = require 'react-nested-router'
Translator = require 'react-translator'

{nav, a, span} = React.DOM

Translator.setStrings
  nav:
    home: 'Zooniverse'
    projects: 'Projects'

module.exports = React.createClass
  displayName: 'MainNav'

  render: ->
    nav className: 'main-nav',
      a href: '#/', className: 'main-item logo',
        span className: 'zooniverse-logo', 'Ø'
        Translator null, 'nav.home'
      a href: '#/projects', className: 'main-item', Translator null, 'nav.projects'
      a href: '#/edit/account', className: 'main-item', 'Edit account'
