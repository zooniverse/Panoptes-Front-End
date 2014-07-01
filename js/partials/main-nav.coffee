React = require 'react'
{Link} = require 'react-nested-router'
Translator = require 'react-translator'

{nav, ul, li, span} = React.DOM

Translator.setStrings
  nav:
    home: 'Zooniverse'
    projects: 'Projects'

module.exports = React.createClass
  displayName: 'MainNav'

  render: ->
    nav className: 'main-nav',
      Link to: 'home', className: 'main-item logo',
        span className: 'zooniverse-logo', 'Ø'
        Translator null, 'nav.home'
      Link to: 'projects', className: 'main-item', Translator null, 'nav.projects'
      Link to: 'edit-account', className: 'main-item', 'Edit account'
