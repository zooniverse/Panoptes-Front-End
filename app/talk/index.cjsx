React = require 'react'
{RouteHandler, Link, Navigation} = require '@edpaget/react-router'
TalkBreadcrumbs = require './breadcrumbs.cjsx'

module?.exports = React.createClass
  displayName: 'Talk'
  mixins: [Navigation]

  onSearchSubmit: (e) ->
    e.preventDefault()
    @transitionTo 'talk-search', {}, { query: React.findDOMNode(@refs.talkSearchInput).value }

  render: ->
    <div className="talk content-container">
      <h1 className="talk-main-link">
        <Link to="talk" params={@props.params}>
          Zooniverse Talk
        </Link>
      </h1>

      <TalkBreadcrumbs {...@props} />

      <form className="talk-search-form" onSubmit={ @onSearchSubmit }>
        <input type="text"
          defaultValue={@props.query?.query}
          placeholder="Search the Zooniverse..."
          ref="talkSearchInput">
        </input>
        <button type="submit">
          <i className="fa fa-search" />
        </button>
      </form>

      <RouteHandler {...@props} section={'zooniverse'} />
    </div>
