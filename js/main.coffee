{Route} = require 'react-nested-router'
App = require './partials/app'
React = window.React = require 'react'

mainRoute = Route handler: App,
  Route name: 'home', path: '/', handler: require './pages/home'
  Route name: 'projects', handler: require './pages/projects'
  Route name: 'edit-account', path: 'edit/account', handler: require './pages/edit-account'

appContainer = document.createElement 'div'
appContainer.id = 'panoptes-main'
document.body.appendChild appContainer

window.panoptesMain = module.exports = React.renderComponent mainRoute, appContainer
