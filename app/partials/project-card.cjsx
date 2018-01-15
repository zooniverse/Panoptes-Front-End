React = require('react')
PropTypes = require 'prop-types'
createReactClass = require 'create-react-class'
FlexibleLink = require('../components/flexible-link').default
Translate = require 'react-translate-component'

ProjectCard = createReactClass
  displayName: 'ProjectCard'
  propTypes:
    project: PropTypes.object.isRequired

  getDefaultProps: ->
    className: ''
    imageSrc: ''
    href: ''
    landingPage: false

  render: ->
    conditionalStyle = {}
    detailStyle = {}

    if @props.landingPage
      detailStyle.cursor = "default"

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
      <div className="project-card #{this.props.className}" ref="projectCard" style={conditionalStyle}>
        <svg viewBox="0 0 2 1" width="100%"></svg>
        <div className="details">
          <div className="name"><span>{@props.project.display_name}</span></div>
          {<hr /> if @props.landingPage}
          {<div className="description">{@props.project.description}</div> if @props.project.description?}
          {if @props.landingPage
            <button className="primary-button" type="button">View Project</button>}
        </div>
      </div>
    </FlexibleLink>

module.exports = ProjectCard
