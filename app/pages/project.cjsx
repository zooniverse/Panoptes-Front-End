React = require 'react'
Route = require '../lib/route'
Link = require '../lib/link'
Markdown = require '../components/markdown'
Dashboard = require './dashboard'
ClassifyPage = require './classify'
PromiseToSetState = require '../lib/promise-to-set-state'

ProjectPage = React.createClass
  displayName: 'ProjectPage'

  componentDidMount: ->
    document.documentElement.classList.add 'on-project-page'

  componentWillUnmount: ->
    document.documentElement.classList.remove 'on-project-page'

  render: ->
    projectRoute = "/projects/#{@props.project.id}"

    <div className="project-page tabbed-content" data-side="top" style={backgroundImage: "url(#{@props.project.background_image})" if @props.project.background_image}>
      <div className="background-darkener"></div>

      <nav className="tabbed-content-tabs">
        <Link href={projectRoute} root={true} className="home tabbed-content-tab">
          <h2><img src={@props.project.avatar} className="project-avatar" />{@props.project.display_name}</h2>
        </Link>
        <Link href="#{projectRoute}/science" className="tabbed-content-tab">Science</Link>
        <Link href="#{projectRoute}/status" className="tabbed-content-tab">Status</Link>
        <Link href="#{projectRoute}/team" className="tabbed-content-tab">Team</Link>
        <Link href="#{projectRoute}/classify" className="classify tabbed-content-tab">Classify</Link>
        <Link href="#{projectRoute}/talk" className="tabbed-content-tab"><i className="fa fa-comments"></i></Link>
      </nav>

      <div className="project-page-content">
        <Route path="#{projectRoute}" className="project-home-content">
          <div className="call-to-action-container content-container">
            <Markdown className="introduction">{@props.project.introduction}</Markdown>
            <div>
              <a href="##{projectRoute}/classify" className="call-to-action">Get started <i className="fa fa-arrow-circle-right"></i></a>
            </div>
          </div>

          <Markdown className="description content-container">
            {@props.project.description}
          </Markdown>
        </Route>

        <Route path="#{projectRoute}/science" className="project-text-content content-container">
          <Markdown>
            {@props.project.science_case}
          </Markdown>
        </Route>

        <Route path="#{projectRoute}/status" className="project-text-content content-container">
          <div>
            <hr Dashboard project={@props.project} />
          </div>
        </Route>

        <Route path="#{projectRoute}/team" className="project-text-content content-container">
          <div>
            <p>Who’s in charge of this project? What organizations are behind it?</p>
          </div>
        </Route>

        <Route path="#{projectRoute}/classify" className="classify-content content-container">
          <ClassifyPage project={@props.project} />
        </Route>

        <Route path="#{projectRoute}/talk" className="project-text-content content-container">
          <div>
            <p>Discussion boards this project</p>
          </div>
        </Route>
      </div>
    </div>

apiClient = window.api = require '../api/client'
PromiseRenderer = require '../components/promise-renderer'

module.exports = React.createClass
  displayName: 'ProjectPageContainer'

  mixins: [PromiseToSetState]

  componentDidMount: ->
    @fetchProject @props.route.params.id

  componentWillReceiveProps: (nextProps) ->
    unless nextProps.route.params.id is @props.route.params.id
      @fetchProject nextProps.route.params.id

  fetchProject: (id) ->
    @promiseToSetState project: apiClient.createType('projects').get id

  render: ->
    if @state.project?.id?
      <ProjectPage project={@state.project} />
    else
      null
