React = require 'react'
apiClient = require '../api/client'
getSubjectLocation = require '../lib/get-subject-location'

module?.exports = React.createClass
  displayName: 'TalkCommentImageSelector'

  getInitialState: ->
    subjects: []

  getDefaultProps: ->
    header: "Select a linked image"

  componentWillMount: ->
    @setRecents()

  setRecents: ->
    @props.user.get('recents', {sort: '-created_at'})
      .then (subjects) => @setState {subjects}

  setQuery: (id) ->
    apiClient.type('subjects').get({id: id})
      .then (subjects) => @setState {subjects}

  onSubmitSearch: (e) ->
    e.preventDefault()
    query = @refs.imageSearch.getDOMNode().value.trim()
    if query is ""
      @setRecents()
    else
      @setQuery(query)

  setFocusImage: (recent) ->
    recent.get('subject').then (subject) =>
      @props.onSelectImage(subject)

  imageItem: (data, i) ->
    <div key={data.id} className="talk-comment-image-item">
      <img src={getSubjectLocation(data).src} />
      <div className="image-card-select">
        <button onClick={=> @setFocusImage(data)}>Select</button>
      </div>
    </div>

  render: ->
    <div className="talk-comment-image-selector">
      <h1>{@props.header}</h1>

      <form onSubmit={@onSubmitSearch}>
        <input ref="imageSearch" type="search" placeholder="Search by ID"/>
      </form>

      <button className='talk-comment-clear-image-button' onClick={@props.onClearImageClick}>Clear image</button>

      <div className="talk-comment-suggested-images">
        {@state.subjects?.map(@imageItem)}
      </div>
    </div>
