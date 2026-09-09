React = require 'react'
createReactClass = require 'create-react-class'
ProjectPageEditor = require '../../../partials/project-page-editor'

module.exports = createReactClass
  displayName: 'EditProjectResearch'

  render: ->
    <div>
      <p className="form-help">This page is for you to describe your research motivations and goals to the volunteers. Feel free to add detail, but try to avoid jargon. This page renders markdown, so you can format it and add images via the Media Library and links.</p>
      <p className="form-help">If your project is using AI or Machine Learning methods, or has training a model as a goal, please review our <a href='https://www.zooniverse.org/about/ai-ethics'>Zooniverse AI Ethics Framework</a> and <a href='https://help.zooniverse.org/next-steps/ai-ethics'>Guidance for Teams Running AI/ML-Engaged Zooniverse Projects</a>.</p>
      <ProjectPageEditor project={@props.project} page="science_case" pageTitle="Research" />
    </div>
