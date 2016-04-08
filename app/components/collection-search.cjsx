React = require 'react'
Select = require 'react-select'
apiClient = require 'panoptes-client/lib/api-client'
debounce = require 'debounce'

module.exports = React.createClass
  displayName: 'CollectionSearch'

  getDefaultProps: ->
    multi: false
    project: null

  searchCollections: (value, callback) ->
    query =
      page_size: 20
      favorite: false
      current_user_roles: 'owner,collaborator'
    query.search = "#{value}" unless value is ''

    apiClient.type('collections').get query
      .then (collections) ->

        opts = collections.map (collection) ->
          {
            value: collection.id,
            label: collection.display_name,
            collection: collection
          }

        callback null, {
          options: opts
        }

  getSelected: ->
    @refs.collectionSelect.state.values

  render: ->
    <Select
      ref="collectionSelect"
      multi={@props.multi}
      name="collids"
      placeholder="Collection Name"
      searchPromptText="Type to search Collections"
      className="collection-search"
      closeAfterClick={true}
      asyncOptions={debounce(@searchCollections, 200)} />
