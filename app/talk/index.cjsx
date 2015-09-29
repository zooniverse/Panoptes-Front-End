React = require 'react'
{RouteHandler, Link} = require '@edpaget/react-router'
TalkBreadcrumbs = require './breadcrumbs.cjsx'
TalkSearchInput = require './search-input'

module?.exports = React.createClass
  displayName: 'Talk'

  render: ->
    <div className="talk content-container">
      <h1 className="talk-main-link">
        <Link to="talk" params={@props.params}>
          Zooniverse Talk
        </Link>
      </h1>

      <TalkBreadcrumbs {...@props} />

      <TalkSearchInput {...@props} placeholder={'Search the Zooniverse...'} />

      <RouteHandler {...@props} section={'zooniverse'} />
    </div>
