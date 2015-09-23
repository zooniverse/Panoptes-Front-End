React = require 'react'

module?.exports = React.createClass
  displayName: 'ProjectMetadata'

  propTypes:
    project: React.PropTypes.object

  render: ->
    {project} = @props

    <div className="project-metadata content-container">
      <div className="project-metadata-header">
        <span>{project.display_name}</span>{' '}
        <span>Statistics</span>
      </div>

      <div className="project-metadata-stats">
        <div className="project-metadata-stat">
          <div>{project.classifiers_count}</div>
          <div>Volunteers</div>
        </div>

        <div className="project-metadata-stat">
          <div>{project.classifications_count}</div>
          <div>Classifications</div>
        </div>

        <div className="project-metadata-stat">
          <div>{project.subjects_count}</div>
          <div>Subjects</div>
        </div>

        <div className="project-metadata-stat">
          <div>{project.retired_subjects_count}</div>
          <div>Retired Subjects</div>
        </div>
      </div>
    </div>
