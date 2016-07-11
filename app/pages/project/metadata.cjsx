React = require 'react'
{Link} = require 'react-router'

module.exports = React.createClass
  displayName: 'ProjectMetadata'

  propTypes:
    project: React.PropTypes.object

  render: ->
    {project} = @props
    [owner, name] = project.slug.split('/')

    <div className="project-metadata content-container">
      <div className="project-metadata-header">
        <span>{project.display_name}</span>{' '}
        <Link to={"/projects/#{owner}/#{name}/stats"}><span>Statistics</span></Link>
      </div>

      <div className="project-metadata-stats">
        <div className="project-metadata-stat">
          <div>{project.classifiers_count.toLocaleString()}</div>
          <div>Registered Volunteers</div>
        </div>

        <div className="project-metadata-stat">
          <div>{project.classifications_count.toLocaleString()}</div>
          <div>Classifications</div>
        </div>

        <div className="project-metadata-stat">
          <div>{project.subjects_count.toLocaleString()}</div>
          <div>Subjects</div>
        </div>

        <div className="project-metadata-stat">
          <div>{project.retired_subjects_count.toLocaleString()}</div>
          <div>Retired Subjects</div>
        </div>
      </div>
    </div>
