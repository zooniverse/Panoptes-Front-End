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
      ul null,
        li null, Link to: 'home', className: 'home-link',
          span className: 'zooniverse-logo', 'Ø'
          Translator null, 'nav.home'
        li null, Link to: 'projects', Translator null, 'nav.projects'
        li null, Link to: 'edit-account', 'Edit account'
