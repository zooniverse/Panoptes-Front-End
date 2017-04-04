React = require 'react'
Select = require 'react-select'
apiClient = require 'panoptes-client/lib/api-client'

module.exports = React.createClass
  displayName: 'CollectionSearch'

  propTypes:
    multi: React.PropTypes.bool
    project: React.PropTypes.object

  getDefaultProps: ->
    multi: false
    project: null

  getInitialState: ->
    collections: []

  onChange: (collections) ->
    @setState {collections}

  searchCollections: (value) ->
    query =
      page_size: 20
      favorite: false
      current_user_roles: 'owner,collaborator,contributor'
    query.search = "#{value}" unless value is ''

    apiClient.type('collections').get query
      .then (collections) ->

        opts = collections.map (collection) ->
          {
            value: collection.id,
            label: collection.display_name,
            collection: collection
          }

        {options: opts}

  getSelected: ->
    @state.collections

  render: ->
    <Select.Async
      ref="collectionSelect"
      multi={@props.multi}
      name="collids"
      value={@state.collections}
      onChange={@onChange}
      placeholder="Type to search Collections"
      searchPromptText="Type to search Collections"
      className="collection-search"
      closeAfterClick={true}
      loadOptions={@searchCollections} />
