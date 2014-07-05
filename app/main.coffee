React = require 'react'
currentUser = require './data/current-user'
MainHeader = require './partials/main-header'
ChildRouter = require 'react-child-router'
MainFooter = require './partials/main-footer'
currentUserActions = require './actions/current-user'

Home = require './pages/home'
SignIn = require './pages/sign-in'
Projects = require './pages/projects'
EditAccount = require './pages/edit-account'
{div} = React.DOM

Main = React.createClass
  getInitialState: ->
    user: null

  componentDidMount: ->
    currentUser.on 'change', this, 'handleUserChange'

  componentWillUnmount: ->
    currentUser.off 'change', this, 'handleUserChange'

  handleUserChange: ->
    @setState user: currentUser.current

  render: ->
    div className: 'panoptes-main',
      MainHeader user: @state.user
      ChildRouter className: 'main-content',
        Home hash: '#'
        SignIn hash: '#/sign-in/*'
        Projects hash: '#/projects'
        EditAccount hash: '#/edit/account/*'
      MainFooter null

mainContainer = document.createElement 'div'
mainContainer.id = 'panoptes-main-container'
document.body.appendChild mainContainer

currentUserActions.check()

React.renderComponent Main(null), mainContainer
