React = require 'react'
PromiseRenderer = require '../../components/promise-renderer'
apiClient = require 'panoptes-client/lib/api-client'
Paginator = require '../../talk/lib/paginator'
ProjectIcon = require '../../components/project-icon'
{Link} = require 'react-router'

module.exports = React.createClass
  displayName: "ProjectStatusPage"

  getProjects: ->
    query =
      page_size: 24
      sort: '-updated_at'
      include: 'avatar'

    Object.assign query, @props.location.query

    delete query.filterBy

    query[@props.location.query.filterBy] = true unless query.slug?

    apiClient.type('projects').get(query)

  render: ->
    <div className="project-status-page">
      <nav className="project-status-filters">
        <Link to="/admin/project_status">All</Link>
        <Link to="/admin/project_status?filterBy=launch_approved">Launch Approved</Link>
        <Link to="/admin/project_status?filterBy=launch_requested">Launch Requested</Link>
        <Link to="/admin/project_status?filterBy=beta_approved">Beta Approved</Link>
        <Link to="/admin/project_status?filterBy=beta_requested">Beta Requested</Link>
      </nav>

      <PromiseRenderer promise={@getProjects()}>{(projects) =>
        projectsMeta = projects[0]?.getMeta()
        if projects.length is 0
          <div className="project-status-list">No projects found for this filter</div>
         else
           <div>
             <div className="project-status-list">
               {projects.map (project) =>
                 [owner, name] = project.slug.split('/')
                 <div key={project.id}>
                   <Link to={"/admin/project_status/#{owner}/#{name}"}>
                     <ProjectIcon linkTo={false} project={project} />
                   </Link>
                 </div>}
             </div>
             <Paginator
               page={projectsMeta?.page}
               pageCount={projectsMeta?.page_count} />
            </div>

      }</PromiseRenderer>
    </div>
