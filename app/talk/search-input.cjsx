React = require 'react'

module.exports = React.createClass
  displayName: 'TalkSearchInput'

  propTypes:
    params: React.PropTypes.object
    query: React.PropTypes.object
    placeholder: React.PropTypes.string

  contextTypes:
    geordi: React.PropTypes.object
    router: React.PropTypes.object.isRequired

  logSearch: (value) ->
    @context?.geordi?.logEvent
      type: 'search'
      data: {searchTerm: value}

  onSearchSubmit: (e) ->
    e.preventDefault()
    {owner, name} = @props.params
    inputValue = @refs.talkSearchInput?.value
    @logSearch inputValue

    if owner and name
      if inputValue.match(/\#[-\w\d]{3,40}/) # searches for #hashtags
        @context.router.push "/projects/#{owner}/#{name}/talk/tags/#{inputValue.slice(1, inputValue.length)}"
      else
        @context.router.push
          pathname: "/projects/#{owner}/#{name}/talk/search"
          query: {query: inputValue}
    else
      @context.router.push
        pathname: "/talk/search"
        query: {query: inputValue}

  componentWillReceiveProps: (nextProps) ->
    return unless @refs.talkSearchInput
    if nextProps.location.query?.query
      @refs.talkSearchInput.value = nextProps.location.query.query
    else
      @refs.talkSearchInput.value = ''

  render: ->
    <form className="talk-search-form" onSubmit={ @onSearchSubmit }>
      <input type="text"
        defaultValue={@props.location.query?.query}
        placeholder={@props.placeholder ? 'Search or enter a #tag'}
        ref="talkSearchInput">
      </input>
      <button type="submit">
        <i className="fa fa-search" />
      </button>
    </form>
