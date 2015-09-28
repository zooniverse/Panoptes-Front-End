React = require 'react'
PromiseRenderer = require '../../components/promise-renderer'
apiClient = require '../../api/client'
Paginator = require '../../talk/lib/paginator'
ProjectIcon = require '../../components/project-icon'
{Navigation, Link} = require 'react-router'

module.exports = React.createClass
  displayName: "ProjectStatusPage"

  mixins: [Navigation]

  getProjects: ->
    query =
      page_size: 24
      sort: '+updated_at'
      include: 'avatar'

    Object.assign query, @props.query

    delete query.filterBy

    query[@props.query.filterBy] = true unless query.slug?

    apiClient.type('projects').get(query)

  render: ->
    <div className="project-status-page">
      <nav className="project-status-filters">
        <Link to="admin-project-list">All</Link>
        <Link to="admin-project-list" query={filterBy: 'launch_approved'}>Launch Approved</Link>
        <Link to="admin-project-list" query={filterBy: 'launch_requested'}>Launch Requested</Link>
        <Link to="admin-project-list" query={filterBy: 'beta_approved'}>Beta Approved</Link>
        <Link to="admin-project-list" query={filterBy: 'beta_requested'}>Beta Requested</Link>
      </nav>

      <PromiseRenderer promise={@getProjects()}>{(projects) =>
        if projects.length is 0
          <div className="project-status-list">No projects found for this filter</div>
         else
           <div>
             <div className="project-status-list">
               {projects.map (project) =>
                 [owner, name] = project.slug.split('/')
                 <div key={project.id}>
                   <Link to="admin-project-status" params={{owner, name}}>
                     <ProjectIcon linkTo={false} project={project} />
                   </Link>
                 </div>}
             </div>
             <Paginator
               page={+@props.query.page}
               pageCount={projects[0]?.getMeta().page_count} />
            </div>

      }</PromiseRenderer>
    </div>
