React = require 'react'
{RouteHandler, Link, Navigation} = require 'react-router'
PromiseRenderer = require '../components/promise-renderer'
TalkBreadcrumbs = require './breadcrumbs.cjsx'
talkClient = require '../api/talk'
CurrentSection = require './mixins/current-section'

module?.exports = React.createClass
  displayName: 'Talk'
  mixins: [Navigation, CurrentSection]

  onSearchSubmit: (e) ->
    e.preventDefault()
    @transitionTo 'talk-search', {}, { query: React.findDOMNode(@refs.talkSearchInput).value }

  render: ->
    <div className="talk content-container">
      <h1>Talk!</h1>
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

      <RouteHandler {...@props} section={@state.currentSection} />
    </div>
