React = require('react')
FlexibleLink = require './flexible-link'
Translate = require 'react-translate-component'

ProjectCard = React.createClass
  displayName: 'ProjectCard'
  propTypes:
    project: React.PropTypes.object.isRequired

  getDefaultProps: ->
    imageSrc: ''
    href: ''

  render: ->
    conditionalStyle = {}

    if !!@props.imageSrc
      conditionalStyle.backgroundImage = "url('#{ @props.imageSrc }')"
    else if !!@props.project.avatar_src
      conditionalStyle.backgroundImage = "url('//#{ @props.project.avatar_src }')"
    else
      conditionalStyle.background = "url('/assets/simple-pattern.png') center center repeat"

    if conditionalStyle.backgroundImage?
      conditionalStyle.backgroundSize = "contain"

    href = if !!@props.project.redirect
      @props.project.redirect
    else if !!@props.href
      @props.href
    else
      '/projects/' + @props.project.slug

    <FlexibleLink to={href}>
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
