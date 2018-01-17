React = require 'react'
createReactClass = require 'create-react-class'
{Link} = require 'react-router'

module.exports = createReactClass
  displayName: 'AboutEditor'

  getDefaultProps: ->
    project: id: '2'

  labPath: (postFix = '') ->
    "/lab/#{@props.project.id}#{postFix}"

  render: ->
    linkParams =
      projectID: @props.project.id
    <div>
      <span>
        <Link to={@labPath('/about/research')} activeClassName="active" className="tabbed-content-tab">
          Research
        </Link>
        <Link to={@labPath('/about/team')} activeClassName="active" className="tabbed-content-tab">
          Team
        </Link>
        <Link to={@labPath('/about/results')} activeClassName="active" className="tabbed-content-tab">
          Results
        </Link>
        <Link to={@labPath('/about/education')} activeClassName="active" className="tabbed-content-tab">
          Education
        </Link>
        <Link to={@labPath('/about/faq')} activeClassName="active" className="tabbed-content-tab">
          FAQ
        </Link>
      </span>
      <p className="form-help about-tab-editor">
        In this section:<br/>
        Header 1 will appear <strong>orange</strong>.<br/>
        Headers 2 - 6 and hyperlinks will appear <strong>dark-blue</strong>.
      </p>
      {React.cloneElement(@props.children, {project: @props.project, user: @props.user})}
    </div>
