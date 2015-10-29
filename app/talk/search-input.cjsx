React = require 'react'
{History} = require 'react-router'

module?.exports = React.createClass
  displayName: 'TalkSearchInput'
  mixins: [History]

  propTypes:
    params: React.PropTypes.object
    query: React.PropTypes.object
    placeholder: React.PropTypes.string

  onSearchSubmit: (e) ->
    e.preventDefault()
    {owner, name} = @props.params
    inputValue = @searchInput().value

    if owner and name
      if inputValue.match(/\#[-\w\d]{3,40}/) # searches for #hashtags
        @history.pushState(null, "/projects/#{owner}/#{name}/talk/tags/#{inputValue.slice(1, inputValue.length)}")
      else
        @history.pushState(null, "/projects/#{owner}/#{name}/talk/search", {query: inputValue})
    else
      @history.pushState(null, "/talk/search", {query: inputValue})

  searchInput: ->
    @refs.talkSearchInput

  componentWillReceiveProps: (nextProps) ->
    if nextProps.location.query?.query
      @searchInput().value = nextProps.location.query.query
    else
      @searchInput().value = ''

  render: ->
    <form className="talk-search-form" onSubmit={ @onSearchSubmit }>
      <input type="text"
        defaultValue={@props.location.query?.query}
        placeholder={@props.placeholder ? "Search..."}
        ref="talkSearchInput">
      </input>
      <button type="submit">
        <i className="fa fa-search" />
      </button>
    </form>

