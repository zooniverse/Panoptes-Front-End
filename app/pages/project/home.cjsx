React = require 'react'
Markdown = require '../../components/markdown'
{Link} = require 'react-router'

module.exports = React.createClass
  displayName: 'ProjectHomePage'

  render: ->
    <div className="project-home-content">
      <div className="call-to-action-container content-container">
        <Markdown className="introduction">{@props.project.introduction}</Markdown>
        <div>
          <Link to="project-classify" params={id: @props.project.id} className="call-to-action">Get started <i className="fa fa-arrow-circle-right"></i></Link>
        </div>
      </div>

      <Markdown className="description content-container">
        {@props.project.description}
      </Markdown>
    </div>
