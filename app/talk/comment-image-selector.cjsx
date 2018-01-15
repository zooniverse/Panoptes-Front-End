React = require 'react'
createReactClass = require 'create-react-class'
apiClient = require 'panoptes-client/lib/api-client'
getSubjectLocation = require '../lib/get-subject-location'
SingleSubmitButton = require '../components/single-submit-button'

module.exports = createReactClass
  displayName: 'TalkCommentImageSelector'

  getInitialState: ->
    subjects: []

  getDefaultProps: ->
    header: "Select a linked image"

  componentWillMount: ->
    @setRecents()

  setRecents: ->
    @props.user.get('recents', {sort: '-created_at'})
      .then (subjects) =>
        subject.type = 'recent' for subject in subjects
        @setState {subjects}
      .catch =>

  setQuery: (id) ->
    apiClient.type('subjects').get({id: id})
      .then (subjects) =>
        subject.type = 'subject' for subject in subjects
        @setState {subjects}
        @setFocusImage(subjects[0]) if subjects?.length is 1
      .catch =>

  onSubmitSearch: (e) ->
    e.preventDefault()
    query = @refs.imageSearch.value.trim()
    if query is ""
      @setRecents()
    else
      @setQuery(query)

  setFocusImage: (image) ->
    if image.type is 'subject'
      @props.onSelectImage image
    else if image.type is 'recent'
      image.get('subject').then (subject) =>
        @props.onSelectImage subject

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

      <form onSubmit={@onSubmitSearch} className="talk-form talk-search-form">
        <input ref="imageSearch" type="search" placeholder="Search by ID"/>
        <SingleSubmitButton type="submit" onClick={@onSubmitSearch}>Search</SingleSubmitButton>
      </form>

      <button className='talk-comment-clear-image-button' onClick={@props.onClearImageClick}>Clear image</button>

      <div className="talk-comment-suggested-images">
        {@state.subjects?.map(@imageItem)}
      </div>
    </div>
