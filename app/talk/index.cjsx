React = require 'react'
{RouteHandler, Link} = require 'react-router'
PromiseRenderer = require '../components/promise-renderer'
TalkBreadcrumbs = require './breadcrumbs.cjsx'
talkClient = require '../api/talk'

module?.exports = React.createClass
  displayName: 'Talk'

  render: ->
    <div className="talk content-container">
      <h1>Talk!</h1>
      <TalkBreadcrumbs {...@props} />

      <span>
        Content to be shared across all talk pages and 
        <input placeholder="a search bar..." />
      </span>
      <RouteHandler {...@props} />
    </div>
