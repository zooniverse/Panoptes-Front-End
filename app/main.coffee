React = window.React = require 'react'
MainHeader = require './partials/main-header'
Routed = require 'react-routed'
MainFooter = require './partials/main-footer'

{div} = React.DOM

app = div className: 'main-app',
  MainHeader null
  Routed className: 'main-content',
    Routed hash: '#/', handler: require './pages/home'
    Routed hash: '#/projects', handler: require './pages/projects'
    Routed hash: '#/edit/account', handler: require './pages/edit-account'
  MainFooter null

appContainer = document.createElement 'div'
appContainer.id = 'panoptes-main'
document.body.appendChild appContainer

module.exports = React.renderComponent app, appContainer
