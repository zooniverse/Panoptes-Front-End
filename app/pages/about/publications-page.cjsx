counterpart = require 'counterpart'
React = require 'react'
createReactClass = require 'create-react-class'
Translate = require 'react-translate-component'
apiClient = require 'panoptes-client/lib/api-client'
Loading = require '../../components/loading-indicator'
`import Publications from '../../lib/publications';`

counterpart.registerTranslations 'en',
  publications:
    nav:
      showAll: 'Show All'
      space: 'Space'
      physics: 'Physics'
      climate: 'Climate'
      humanities: 'Humanities'
      nature: 'Nature'
      medicine: 'Medicine'
      meta: 'Meta'
    content:
      header:
        showAll: 'All Publications'

module.exports = createReactClass
  displayName: 'PublicationsPage'

  getInitialState: ->
    currentSort: 'showAll'

  componentDidMount: ->
    @loadProjects()
    document.documentElement.classList.add 'on-secondary-page'

  componentWillUnmount: ->
    document.documentElement.classList.remove 'on-secondary-page'

  projectSlugs: ->
    slugs = []
    for category, list of Publications
      slugs = slugs.concat(project.slug for project in list when project.slug)
    slugs

  loadProjects: ->
    numProjectsToRequest = @projectSlugs().length
    apiClient.type('projects')
      .get(slug: @projectSlugs(), cards: true, page_size: numProjectsToRequest)
      .then (projects) =>
        projectMap = { }
        projectMap[project.slug] = project for project in projects
        @setState projects: projectMap

  render: ->
    sideBarNav = counterpart "publications.nav"
    <div className="publications-page secondary-page-copy">
      <aside className="secondary-page-side-bar">
        <nav ref="sideBarNav">
          {for navItem of sideBarNav
            <button key={navItem} ref={navItem} className="secret-button side-bar-button" style={fontWeight: 700 if @state.currentSort is navItem} onClick={@showPublicationsList.bind(null, navItem)}><Translate content="publications.nav.#{navItem}" /></button>}
        </nav>
      </aside>
      <section className="publications-content">
        <h2>{if @state.currentSort is 'showAll'
              <Translate content="publications.content.header.showAll" />
            else
              @state.currentSort
        }</h2>
        {if @state.projects
          for category, projects of Publications
            if (@state.currentSort is category) or (@state.currentSort is 'showAll')
              <ul key={category} className="publications-list">
                {for projectListing in projects
                  project = @state.projects[projectListing.slug]
                  <div key={projectListing.name or projectListing.slug}>
                    <div>
                      <h3 className="project-name">
                        {if project then project.display_name else projectListing.name}
                      </h3>
                      <span className="publication-count">{' '}({projectListing.publications.length})</span>
                    </div>
                    {projectListing.publications.map (publication) =>
                      i = Math.random()
                      <li key="publication-#{i}" className="publication-item">
                        {@avatarFor(project)}
                        <div className="citation">
                          <p>
                            <cite>{publication.citation}</cite><br />
                            {if publication.href? then <a href={publication.href} target="_blank">View publication.</a>}{' '}
                            {if publication.openAccess? then <a href={publication.openAccess} target="_blank">View open access version.</a>}
                          </p>
                        </div>
                      </li>}
                  </div>
              }</ul>
        else
          <Loading />}
      </section>
    </div>

  showPublicationsList: (navItem) ->
    @setState currentSort: navItem

  avatarFor: (project) ->
    src = if project?.avatar_src
      "//#{ project.avatar_src }"
    else
      '/assets/simple-avatar.png'
    <img src={src} alt="Project Avatar" />
