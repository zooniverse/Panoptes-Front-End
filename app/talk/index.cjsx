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

      <form onSubmit={ @onSearchSubmit }>
        <input type="text" defaultValue={@props.query?.query || 'search'} ref="talkSearchInput" />
        <button type="submit">Search</button>
      </form>

      <RouteHandler {...@props} section={@state.currentSection} />
    </div>
