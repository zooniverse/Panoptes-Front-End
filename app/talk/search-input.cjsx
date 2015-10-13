React = require 'react'
{Navigation} = require '@edpaget/react-router'

module?.exports = React.createClass
  displayName: 'TalkSearchInput'
  mixins: [Navigation]

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
        @transitionTo 'project-talk-tags',
          owner: owner, name: name, tag: inputValue.slice(1, inputValue.length)
      else
        @transitionTo 'project-talk-search', @props.params, query: inputValue
    else
      @transitionTo 'talk-search', {}, {query: inputValue}

  searchInput: ->
    React.findDOMNode(@refs.talkSearchInput)

  componentWillReceiveProps: (nextProps) ->
    if nextProps.query?.query
      @searchInput().value = nextProps.query.query
    else
      @searchInput().value = ''

  render: ->
    <form className="talk-search-form" onSubmit={ @onSearchSubmit }>
      <input type="text"
        defaultValue={@props.query?.query}
        placeholder={@props.placeholder ? "Search..."}
        ref="talkSearchInput">
      </input>
      <button type="submit">
        <i className="fa fa-search" />
      </button>
    </form>

