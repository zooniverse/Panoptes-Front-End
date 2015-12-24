React = require 'react'
Select = require 'react-select'
apiClient = require '../api/client'
debounce = require 'debounce'

module.exports = React.createClass
  displayName: 'CollectionSearch'

  getDefaultProps: ->
    multi: false
    project: null

  getInitialState: ->
    collections: []

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

  addSelected:(collIds) ->
    options = @refs.collectionSelect.state.options
    lastId = collIds.split(",").slice(-1)[0]
    collection = options.filter (col) ->
      col.value == lastId
    @setState({ collections: @state.collections.slice().concat(collection), value: collIds })

  getSelected: ->
    @refs.collectionSelect.state.values

  render: ->
    <Select
      ref="collectionSelect"
      multi={@props.multi}
      name="collids"
      value={this.state.value}
      placeholder="Collection Name"
      searchPromptText="Type to search Collections"
      className="collection-search"
      closeAfterClick={true}
      onChange={@addSelected}
      asyncOptions={debounce(@searchCollections, 200)} />
