React = require('react')
FlexibleLink = require './flexible-link'
Translate = require 'react-translate-component'

ProjectCard = React.createClass
  displayName: 'ProjectCard'
  propTypes:
    project: React.PropTypes.object.isRequired

  getDefaultProps: ->
    avatar: ''
    name: ''
    slug: ''

  componentDidMount: ->
    card = @refs.projectCard

    Promise.resolve (if @props.project.avatar_src then "//#{ @props.project.avatar_src }" else '/assets/simple-avatar.jpg')
      .then (src) =>
        card.style.backgroundImage = "url('#{src}')"
        card.style.backgroundSize = "contain"
      .catch =>
        card.style.background = "url('/assets/simple-pattern.jpg') center center repeat"

    card.classList.add 'project-card'

  render: ->
    project = @props.project
    avatarSrcWithProtocol = if !!project.avatar_src
      'https://' + project.avatar_src

    linkProps =
      to: if project.redirect then project.redirect else '/projects/' + project.slug

    <FlexibleLink {...linkProps}>
      <div className="project-card" ref="projectCard">
        <svg className="card-space-maker" viewBox="0 0 2 1" width="100%"></svg>
        <div className="details">
          <div className="name"><span>{project.display_name}</span></div>
          {<div className="description">{project.description}</div> if project.description?}
          <button type="button" tabIndex="-1" className="standard-button card-button"><Translate content={"projectsPage.button"} /></button>
        </div>
      </div>
    </FlexibleLink>

module.exports = ProjectCard