React = require 'react'
ChildRouter = require 'react-child-router'
{Link} = ChildRouter
Markdown = require '../components/markdown'
LoadingIndicator = require '../components/loading-indicator'

EXAMPLE_PROJECT =
  name: 'Galaxy Zoo'
  owner_name: 'Zooniverse'
  avatar: 'https://pbs.twimg.com/profile_images/2597266958/image.jpg'
  background_image: 'http://upload.wikimedia.org/wikipedia/commons/thumb/4/43/ESO-VLT-Laser-phot-33a-07.jpg/1280px-ESO-VLT-Laser-phot-33a-07.jpg'
  description: 'Help futher our understanding of galaxy formation.'
  introduction: new Array(5).join '''
    This is an _introduction_ with some **Markdown**. This paragraph has some <em>HTML</em>. This is an _introduction_ with some **Markdown**. This paragraph has some <em>HTML</em>.
  ''' + '\n\n'
  science_case: '''
    Here's the science case for this project...
  '''
  team_members: []
  workflows: {}

module.exports = React.createClass
  displayName: 'ProjectPage'

  componentWillMount: ->
    document.documentElement.classList.add 'on-project-page'
    @loadProject @props.params

  componentWillUnmount: ->
    document.documentElement.classList.remove 'on-project-page'

  loadProject: (query) ->
    console?.info "Loading project owned by '#{query.owner}' and named '#{query.name}'"
    setTimeout @setState.bind(this, project: EXAMPLE_PROJECT), 1000

  render: ->
    if @state?.project?
      qualifiedProjectName = "#{@state.project.owner_name}/#{@state.project.name}"
      <div className="project-page tabbed-content" data-side="top" style={backgroundImage: "url(#{@state.project.background_image})"}>
        <div className="background-cover"></div>
        <nav className="tabbed-content-tabs">
          <Link href="#/projects/#{qualifiedProjectName}" className="home tabbed-content-tab"><h2><img src={@state.project.avatar} className="project-avatar"/>{@state.project.name}</h2></Link>
          <Link href="#/projects/#{qualifiedProjectName}/science" className="tabbed-content-tab">Science</Link>
          <Link href="#/projects/#{qualifiedProjectName}/status" className="tabbed-content-tab">Status</Link>
          <Link href="#/projects/#{qualifiedProjectName}/team" className="tabbed-content-tab">Team</Link>
          <Link href="#/projects/#{qualifiedProjectName}/classify" className="classify tabbed-content-tab">Classify</Link>
          <Link href="#/projects/#{qualifiedProjectName}/talk" className="tabbed-content-tab"><i className="fa fa-comments"></i></Link>
        </nav>

        <ChildRouter className="project-page-content">
          <div hash="#/projects/:owner/:name" className="project-home-content">
            <div className="call-to-action-conatiner content-container">
              <a href="#/projects/#{qualifiedProjectName}/classify" className="call-to-action">Get started</a>
            </div>
            <Markdown className="project-introduction content-container">
              {@state.project.introduction}
            </Markdown>
          </div>

          <Markdown hash="#/projects/:owner/:name/science" className="project-text-content content-container">
            {@state.project.science_case}
          </Markdown>

          <div hash="#/projects/:owner/:name/status" className="project-text-content content-container">
            <p>Status dashboard for this project</p>
          </div>

          <div hash="#/projects/:owner/:name/team" className="project-text-content content-container">
            <p>Who’s in charge of this project? What organizations are behind it?</p>
          </div>

          <div hash="#/projects/:owner/:name/classify" className="classify-content content-container">
            <p>Classification interface for this project</p>
          </div>

          <div hash="#/projects/:owner/:name/talk" className="project-text-content content-container">
            <p>Discussion boards this project</p>
          </div>
        </ChildRouter>
      </div>

    else
      <div className="content-container">
        <LoadingIndicator />
      </div>
