React = require 'react'
apiClient = require 'panoptes-client/lib/api-client'
OwnedCardList = require '../../components/owned-card-list'

List = React.createClass
  displayName: 'List'

  imagePromise: (collection) ->
    apiClient.type('subjects').get(collection_id: collection.id, page_size: 1)
      .then ([subject]) ->
        if subject?
          firstKey = Object.keys(subject.locations[0])[0]
          subject.locations[0][firstKey]
        else
          '/simple-avatar.jpg'

  cardLink: (collection) ->
    [collection_owner, collection_name] = collection.slug.split('/')
    "/collections/#{collection_owner}/#{collection_name}"

  listCollections: ->
    query = {}
    if @props.params?.collection_owner?
      query.owner = @props.params.collection_owner
      query.include = 'owner'

    query.favorite = @props.favorite
    Object.assign query, @props.location.query

    apiClient.type('collections').get query

  render: ->
    <OwnedCardList
      {...@props}
      listPromise={@listCollections()}
      linkTo="collections"
      skipOwner={@props.params?.collection_owner?}
      imagePromise={@imagePromise}
      cardLink={@cardLink} />

module.exports = List
