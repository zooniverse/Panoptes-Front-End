React = require 'react'
window.React = React
MainHeader = require './partials/main-header'
Route = require './lib/route'
MainFooter = require './partials/main-footer'

Home = require './pages/home'
SignIn = require './pages/sign-in'
Projects = require './pages/projects'
Project = require './pages/project'
Settings = require './pages/settings'
UserProfile = require './pages/user-profile'
Build = require './pages/build'
CreateProject = require './pages/create-project'
EditProject = require './pages/edit-project'

NotificationViewer = require './components/notification-viewer'

Main = React.createClass
  displayName: 'Main'

  getInitialState: ->
    currentLogin: null
    loggingIn: false

  handleLoginChange: ->
    @setState
      currentLogin: null
      loggingIn: false

  render: ->
    if location.search.indexOf('test-classifier=1') isnt -1
      return @renderClassifier()

    <div className="panoptes-main">
      <MainHeader />

      <div className="main-content">
        <Route path="/" handler={Home} />
        <Route path="/sign-in(/:form)" handler={SignIn} currentLogin={@state.currentLogin} loggingIn={@state.loggingIn} />
        <Route path="/projects" handler={Projects} />
        <Route path="/projects/:id(/*etc)" handler={Project} />
        <Route path="/settings(/:section)" handler={Settings} />
        <Route path="/users/:login(/:section)" handler={UserProfile} />
        <Route path="/build" handler={Build} />
        <Route path="/build/new-project(/*section)" handler={CreateProject} />
        <Route path="/build/edit-project/:projectID" handler={EditProject} />
      </div>

      <MainFooter />

      <NotificationViewer event="notify" />
    </div>

  renderClassifier: ->
    if process.env.NODE_ENV isnt 'production'
      # This is just a blank image for testing drawing tools.
      DEMO_IMAGE = ['data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAoAAAAHgAQMAAAA',
        'PH06nAAAABlBMVEXMzMyWlpYU2uzLAAAAPUlEQVR4nO3BAQ0AAADCoPdPbQ43oAAAAAAAAAAAAA',
        'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgzwCX4AAB9Dl2RwAAAABJRU5ErkJggg=='].join ''

      Classifier = require './classifier/classifier'
      {Type, Resource} = require 'json-api-client'

      Resource::_type = new Type

      workflow = new Resource {
        tasks: draw:
          type: 'drawing'
          tools: [
            {type: 'line', value: 'line', label: 'Line', color: 'magenta'}
            {type: 'ellipse', value: 'ellipse', label: 'Ellipse', color: 'magenta'}
            {type: 'point', value: 'point', label: 'Point', color: 'magenta'}
          ]
      }
      subject = new Resource locations: [{'image/svg': DEMO_IMAGE}]
      classification = new Resource annotations: [{task: 'draw'}]

      <Classifier workflow={workflow} subject={subject} classification={classification} />

mainContainer = document.createElement 'div'
mainContainer.id = 'panoptes-main-container'
document.body.appendChild mainContainer

React.render <Main />, mainContainer
