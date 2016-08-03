React = require 'react'
apiClient = require 'panoptes-client/lib/api-client'
Loading = require '../components/loading-indicator'
CollectionPreview = require '../collections/preview'

module.exports = React.createClass
  displayName: 'SubjectCollectionList'

  componentWillMount: ->
    @getCollections()

  getInitialState: ->
    collections: null

  getCollections: ->
    query =
      subject_id: @props.subject.id
      page_size: 20
      sort: '-created_at'
      include: 'owner'

    apiClient.type('collections').get(query).then (collections) =>
      @setState {collections}

  render: ->
    return <Loading /> unless @state.collections

    if @state.collections.length > 0
      <div className="subject-collection-list">
        <h2>Collections:</h2>
        <div className="subject-collection-list-container">
          {for collection in @state.collections
            <CollectionPreview project={@props.project} key={"collection-#{ collection.id }"} collection={collection} />}
        </div>
      </div>
    else
      <p>There are no collections yet</p>
