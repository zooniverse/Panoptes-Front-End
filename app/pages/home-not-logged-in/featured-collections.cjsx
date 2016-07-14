React = require 'react'
ReactDOM = require 'react-dom'
{Link} = require 'react-router'
apiClient = require 'panoptes-client/lib/api-client'
FEATURED_COLLECTION_IDS = require '../../lib/featured-collections'
getSubjectLocation = require '../../lib/get-subject-location'

hovered = false

module.exports = React.createClass
  displayName: 'HomePageFeaturedCollections'

  getInitialState: ->
    collections: []
    index: 0
    timer: null

  componentDidMount: ->
    @loadCollections().then (collections) =>
      for collection in collections when collection.image
        image = new Image()
        image.src = collection.image

      timer = setInterval =>
        unless hovered
          ReactDOM.findDOMNode(@refs.description).classList.add 'appearing'
          @setState index: (@state.index + 1) % @state.collections.length
      , 5000

      @setState {collections, timer}

  componentWillUnmount: ->
    clearInterval(@state.timer) if @state.timer
    @setState timer: null

  loadSubjectsFor: (collections) ->
    collections.map (collection) =>
      collection.get('subjects', page_size: 1)
        .then ([subject]) =>
          collection.image = getSubjectLocation(subject)?.src
          collection

  loadOwnersFor: (collections) ->
    collections.map (collection) =>
      collection.get('owner')
        .then (owner) =>
          collection.owner = owner
          collection

  loadCollections: ->
    apiClient.type('collections').get(id: FEATURED_COLLECTION_IDS).then (collections) =>
      withOwners = @loadOwnersFor collections
      withSubjects = @loadSubjectsFor collections
      Promise.all(withOwners.concat(withSubjects)).then => collections

  hovered: ->
    hovered = true

  unhovered: ->
    hovered = false

  setIndex: (i) ->
    =>
      @setState(index: i) if i >= 0 and i < @state.collections.length

  render: ->
    collection = @state.collections[@state.index]
    return <div /> unless collection
    @refs?.description?.classList?.add 'appearing'
    background = collection.image or './assets/default-collection-background.jpg'

    setTimeout =>
      ReactDOM.findDOMNode(@refs.description).classList.remove 'appearing'
    , 100

    <section className="home-featured-collections" style={backgroundImage: "url(#{background})"} onMouseEnter={@hovered} onMouseLeave={@unhovered}>
      <h1>{collection.display_name}</h1>

      <div><p ref="description" className="description">{collection.description}</p></div>

      <h2>
        <Link to={"/collections/#{collection.slug}"} className="standard-button">Check it out</Link>
      </h2>

      <div className="controls">
        <i className="fa fa-angle-left" onClick={@setIndex(@state.index - 1)} />
        {for featuredCollection, i in @state.collections
          if featuredCollection.id is collection.id
            <i key={"featured-collection-#{featuredCollection.id}"} className="fa fa-circle" />
          else
            <i key={"featured-collection-#{featuredCollection.id}"} className="fa fa-circle-o" onClick={@setIndex(i)} />}
        <i className="fa fa-angle-right" onClick={@setIndex(@state.index + 1)} />
      </div>

      <p className="owner">
        From the collection of <strong>{featuredCollection.owner.display_name}</strong>
      </p>
    </section>
