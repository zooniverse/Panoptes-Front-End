React = require('react')
PropTypes = require 'prop-types'
createReactClass = require 'create-react-class'
FlexibleLink = require('../components/flexible-link').default
Translate = require 'react-translate-component'

monorepoSlugs = require('../monorepoSlugs').default

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
    usesMonorepo = monorepoSlugs.includes(@props.project.slug)
    monorepoLink = if window.location.hostname is 'www.zooniverse.org'
        "https://www.zooniverse.org/projects/#{@props.project.slug}"
      else
        "https://frontend.preview.zooniverse.org/projects/#{@props.project.slug}"

    if @props.landingPage
      detailStyle.cursor = "default"

    if !!@props.imageSrc
      conditionalStyle.backgroundImage = "url('#{ @props.imageSrc }')"
    else if !!@props.project.avatar_src
      urlRegex = new RegExp('^https?:\/\/[^\s]+');
      if urlRegex.test(@props.project.avatar_src)
        backgroundImageSrc = @props.project.avatar_src
      else
        backgroundImageSrc = "//#{ @props.project.avatar_src }"

      conditionalStyle.backgroundImage = "url('#{ backgroundImageSrc }')"
    else
      conditionalStyle.background = "url('/assets/simple-pattern.png') center center repeat"

    if conditionalStyle.backgroundImage?
      conditionalStyle.backgroundSize = "contain"

    href = if !!@props.project.redirect
      @props.project.redirect
    else if !!@props.href
      @props.href
    else if usesMonorepo
      monorepoLink
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
