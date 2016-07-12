React = require('react')
FlexibleLink = require './flexible-link'
Translate = require 'react-translate-component'

ProjectCard = React.createClass
  displayName: 'ProjectCard'
  propTypes:
    project: React.PropTypes.object.isRequired

  getDefaultProps: ->
    imageSrc: ''
    name: ''
    slug: ''

  render: ->
    conditionalStyle = {}

    if !!@props.imageSrc
      conditionalStyle.backgroundImage = "url('#{ @props.imageSrc }')"
    else if !!@props.project.avatar_src
      conditionalStyle.backgroundImage = "url('//#{ @props.project.avatar_src }')"
    else
      conditionalStyle.background = "url('/assets/simple-pattern.jpg') center center repeat"

    if conditionalStyle.backgroundImage?
      conditionalStyle.backgroundSize = "contain"

    linkProps =
      to: if @props.project.redirect then @props.project.redirect else '/projects/' + @props.project.slug

    <FlexibleLink {...linkProps}>
      <div className="project-card" ref="projectCard" style={conditionalStyle}>
        <svg className="card-space-maker" viewBox="0 0 2 1" width="100%"></svg>
        <div className="details">
          <div className="name"><span>{@props.project.display_name}</span></div>
          {<div className="description">{@props.project.description}</div> if @props.project.description?}
          <button type="button" tabIndex="-1" className="standard-button card-button"><Translate content={"projectsPage.button"} /></button>
        </div>
      </div>
    </FlexibleLink>

module.exports = ProjectCard
