React = require('react')
`import FlexibleLink from '../components/flexible-link';`
Translate = require 'react-translate-component'

ProjectCard = React.createClass
  displayName: 'ProjectCard'
  propTypes:
    project: React.PropTypes.object.isRequired

  getDefaultProps: ->
    customCSS: ''
    imageSrc: ''
    href: ''
    landingPage: false

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

    cardBody =
      <div className="project-card #{this.props.customCSS}" ref="projectCard" style={conditionalStyle}>
        <svg viewBox="0 0 2 1" width="100%"></svg>
        <div className="details">
          <div className="name"><span>{@props.project.display_name}</span></div>
          {<div className="description">{@props.project.description}</div> if @props.project.description?}
          <button type="button" tabIndex="-1" className="standard-button card-button"><Translate content={"projectsPage.button"} /></button>
          {if @props.landingPage
            <button className="primary-button" type="button">View Project</button>
          }
        </div>
      </div>

    if !@props.landingPage
      <FlexibleLink to={href}>
        {cardBody}
      </FlexibleLink>
    else
        cardBody

module.exports = ProjectCard
