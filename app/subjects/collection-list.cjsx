React = require 'react'
apiClient = require 'panoptes-client/lib/api-client'
Loading = require '../components/loading-indicator'
CollectionPreview = require '../collections/preview'

module.exports = React.createClass
  displayName: 'SubjectCollectionList'

  getDefaultProps: ->
    collections: null

  render: ->
    return <Loading /> unless @props.collections

    if @props.collections.length > 0
      <div className="subject-collection-list">
        <h2>Collections:</h2>
        <div className="subject-collection-list-container">
          {for collection in @props.collections
            <CollectionPreview project={@props.project} key={"collection-#{ collection.id }"} collection={collection} />}
        </div>
      </div>
    else
      <p>There are no collections yet</p>
