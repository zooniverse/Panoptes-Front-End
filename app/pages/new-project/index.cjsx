counterpart = require 'counterpart'
React = require 'react'
Translate = require 'react-translate-component'
ChangeListener = require '../../components/change-listener'
data = require './data'
{Link, RouteHandler} = require 'react-router'

counterpart.registerTranslations 'en',
  newProject:
    nav:
      general: 'General'
      scienceCase: 'Science case'
      subjects: 'Subjects'
      workflow: 'Workflow'
      review: 'Review'

StepStatusIcon = React.createClass
  displayName: 'StepStatusIcon'

  render: ->
    [iconClass, style] = if @props.completed
      ['fa-check', color: 'green']
    else if @props.error
      ['fa-times', color: 'red']
    else
      ['fa-pencil', opacity: 0.5]

    <i className="fa #{iconClass} fa-fw" style={style}></i>

module.exports = React.createClass
  displayName: 'CreateProjectPage'

  render: ->
    <ChangeListener target={data} handler={@renderWizard} />

  renderWizard: ->
    <div className="create-project-page tabbed-content content-container" data-side="top">
      <nav className="tabbed-content-tabs">
        <Link to="new-project-general" root={true} className="tabbed-content-tab">
          <Translate content="newProject.nav.general" />
          <StepStatusIcon completed={data.name and data.introduction and data.description} />
        </Link>

        <Link to="new-project-science-case" className="tabbed-content-tab">
          <Translate content="newProject.nav.scienceCase" />
          <StepStatusIcon completed={data.scienceCase} />
        </Link>

        <Link to="new-project-subjects" className="tabbed-content-tab">
          <Translate content="newProject.nav.subjects" />
          <StepStatusIcon completed={Object.keys(data.subjects).length isnt 0} />
        </Link>

        <Link to="new-project-workflow" className="tabbed-content-tab">
          <Translate content="newProject.nav.workflow" />
          <StepStatusIcon completed={try Object.keys(JSON.parse(data.tasks)).length isnt 0} />
        </Link>

        <Link to="new-project-review" className="tabbed-content-tab">
          <Translate content="newProject.nav.review" />
        </Link>
      </nav>

      <RouteHandler />
    </div>
