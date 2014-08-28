# @cjsx React.DOM

React = window.React = require 'react'
loginStore = require './data/login'
MainHeader = require './partials/main-header'
ChildRouter = require 'react-child-router'
MainFooter = require './partials/main-footer'

Home = require './pages/home'
SignIn = require './pages/sign-in'
Projects = require './pages/projects'
Project = require './pages/project'
Settings = require './pages/settings'
UserProfile = require './pages/user-profile'
Build = require './pages/build'

Main = React.createClass
  displayName: 'Main'

  mixins: [loginStore.mixin]

  render: ->
    <div className="panoptes-main">
      <MainHeader login={loginStore.current} loading={loginStore.loading} />

      <ChildRouter className="main-content">
        <Home hash="#" />
        <SignIn hash="#/sign-in/*" />
        <Projects hash="#/projects" />
        <Projects hash="#/projects/:categories" />
        <Project hash="#/projects/:owner/:name/*" />
        <Settings hash="#/settings/*" login={loginStore.current} loading={loginStore.loading} />
        <UserProfile hash="#/users/:login/*" />
        <Build hash="#/build/*" />
      </ChildRouter>

      <MainFooter />
    </div>

mainContainer = document.createElement 'div'
mainContainer.id = 'panoptes-main-container'
document.body.appendChild mainContainer

React.renderComponent Main(null), mainContainer

login = require './data/login'
login.check()
