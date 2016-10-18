counterpart = require 'counterpart'
React = require 'react'
Translate = require 'react-translate-component'
{Link} = require 'react-router'
apiClient = require 'panoptes-client/lib/api-client'
PromiseRenderer = require '../components/promise-renderer'
ZooniverseLogoType = require '../partials/zooniverse-logotype'
ProjectCard = require '../partials/project-card'
FEATURED_PROJECTS = require '../lib/featured-projects'
{Markdown} = (require 'markdownz').default
ProjectIcon = require '../components/project-icon'

counterpart.registerTranslations 'en',
  home:
    hero:
      title: 'People-Powered Research'
      tagline: '''The Zooniverse provides opportunities for people around the world to contribute to real discoveries in fields ranging from astronomy to zoology. Welcome to the largest online platform for collaborative volunteer research.'''
      button: 'Get involved now!'
    about:
      contribute:
        title: 'Contribute to new research'
        content: '''The Zooniverse lets everyone take part in real, cutting-edge research in many fields across the sciences, humanities, and more. There’s no previous experience required; just pick a project and [get started right away](/projects).'''
      explore:
        title: 'Explore incredible worlds'
        content: '''Astronomical marvels, exotic wildlife in their natural habitats, original historical documents: just a few of the fascinating things you’ll get to experience in the Zooniverse. In many cases, you’ll literally be seeing things no one has seen before.'''
      collaborate:
        title: 'Collaborate with researchers'
        content:'''Professional researchers and volunteers share our [discussion boards](/talk), using them to explore and analyse project data. Much of the most exciting research produced by the Zooniverse originates from these partnerships.'''
      discover:
        title: 'Discover, teach, and learn'
        content: '''Our platform offers many opportunities for education, from using projects in classrooms to sharing information between volunteers. You can even use the [Zooniverse Project Builder](/lab) to create your very own project!'''
    featuredProjects:
      title: 'Get started on a new project right now!'
      button: 'See all projects'
    recentProjects:
      title: "Welcome back! Jump into one of your recent projects..."
      altTitle: "Welcome! Jump into a new project..."
      button: 'See all your projects'
      altButton: 'See all our projects'

FeaturedProjects = React.createClass
  displayName: "FeaturedProjects"

  imagePromise: (project) ->
    src = if project.avatar_src
      "//#{ project.avatar_src }"
    else
      '/assets/simple-avatar.jpg'
    Promise.resolve src

  render: ->
    <div className="featured-projects">
      <PromiseRenderer promise={apiClient.type('projects').get(id: Object.keys(FEATURED_PROJECTS), cards: true)}>{(projects) =>
        if projects?
          <div className="featured-projects-list">
          {for project in projects
            <ProjectCard key={project.id} project={project} />}
          </div>
      }</PromiseRenderer>
      <Link to="/projects" className="call-to-action standard-button x-large"><Translate content="home.featuredProjects.button" /></Link>
    </div>

RecentProjects = React.createClass
  displayName: 'RecentProjects'

  getInitialState: ->
    projects: []
    activityCounts: {}
    title: ""
    href: ''
    action: ""

  componentWillMount: ->
    @props.user
      .get("project_preferences", page_size: 10, sort: '-updated_at')
      .then (projectPreferences) =>
        userProjects = projectPreferences.map (projectPreference) -> projectPreference.links.project if projectPreference.activity_count > 0
        userProjects = userProjects.filter(Boolean).slice 0, 4
        activityCounts = {}
        if userProjects.length > 0
          activityCounts[projectPreference.links.project] = projectPreference.activity_count for projectPreference in projectPreferences
          @setState
            activityCounts: activityCounts
            title: "home.recentProjects.title"
            href: "/users/#{@props.user.login}/stats"
            action: "home.recentProjects.button"
          projectsPromise = apiClient.type('projects').get(id: userProjects, cards: true)
        else
          @setState
            title: "home.recentProjects.altTitle"
            href: '/projects'
            action: "home.recentProjects.altButton"
          projectsPromise = apiClient.type('projects').get(launch_approved: true, page_size: 4, cards: true)
        projectsPromise
      .then (projects) =>
        @setState {projects}

  render: ->
    if @state.projects.length > 0
      <div className="recent-projects">
          <Translate component="h5" content={@state.title} />
          <div className="recent-projects-list">
            {for project in @state.projects
              badge = @state.activityCounts[project.id] ? 0
              <div key={project.id}>
                <ProjectIcon project={project} badge={badge} />
                &ensp;
              </div>}
          </div>
          <Link to={@state.href} className="call-to-action standard-button x-large"><Translate content={@state.action} /></Link>
      </div>
    else
      null


module.exports = React.createClass
  displayName: 'HomePage'

  componentDidMount: ->
    document.documentElement.classList.add 'on-home-page'

  componentWillUnmount: ->
    document.documentElement.classList.remove 'on-home-page'

  lastFourProjects: ->
    @props.user.get("project_preferences", page_size: 4, sort: '-updated_at')

  render: ->
    aboutItems = ['contribute', 'explore', 'collaborate', 'discover']
    baseLink = "/"
    if @props.project?
      baseLink += "projects/#{@props.project.slug}/"
    <div className="home-page">
      <div className="flex-container">
        <section className="hero on-dark">
          <ZooniverseLogoType />
          <RecentProjects user={@props.user} />
        </section>
      </div>

      <section className="featured-projects content-container">
        <Translate component="h5" content="home.featuredProjects.title" />
        <FeaturedProjects />
      </section>
    </div>

  showLoginDialog: (which) ->
    alert (resolve) ->
      <LoginDialog which={which} onSuccess={resolve} />
