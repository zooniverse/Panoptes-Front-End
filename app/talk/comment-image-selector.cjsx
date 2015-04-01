React = require 'react'
apiClient = require '../api/client'
authClient = require '../api/auth'
getSubjectLocation = require '../lib/get-subject-location'

module?.exports = React.createClass
  displayName: 'TalkCommentImageSelector'

  getInitialState: ->
    recents: []

  getDefaultProps: ->
    header: "Select a featured image"

  componentWillMount: ->
    @setRecents()

  setRecents: ->
    authClient.checkCurrent()
      .then (user) => user.get('recents')
        .then (recents) => @setState {recents}
      .catch (e) ->
        console.log "error setting recents", e

  queryForImages: (query) ->
    # this will make a db query and then return array of matching images
    DEV_IMAGES.filter (img) => img.id.toLowerCase() is query.toLowerCase()

  onSubmitSearch: (e) ->
    e.preventDefault()
    return @setRecents() # TODO un-disable search (remove this line)
    ###
    query = @refs.imageSearch.getDOMNode().value
    if query is ""
      @setInitialImages()
    else
      @setState images: @queryForImages(query)
    ###

  setFocusImage: (recentsData) ->
    recentsData.get('subject')
      .then (subject) =>
        @props.onSelectImage(subject)
      .catch (e) -> console.log "couldent get subject data", e

  imageItem: (data, i) ->
    {src} = getSubjectLocation(data)
    <div key={i} className="talk-comment-image-item">
      <img src={'http://' + src} />
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
        {@state.recents?.map(@imageItem)}
      </div>
    </div>
