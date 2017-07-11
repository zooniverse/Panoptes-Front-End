React = require 'react'
Select = require 'react-select'
apiClient = require 'panoptes-client/lib/api-client'

module.exports = React.createClass
  displayName: 'CollectionSearch'

  propTypes:
    multi: React.PropTypes.bool.isRequired
    onChange: React.PropTypes.func

  getDefaultProps: ->
    multi: false

  getInitialState: ->
    collections: []

  onChange: (collections) ->
    @setState({ collections }, ->
      if @props.onChange
        @props.onChange()
    )

  searchCollections: (value) ->
    query =
      page_size: 20
      favorite: false
      current_user_roles: 'owner,collaborator,contributor'
    query.search = "#{value}" unless value is ''

    apiClient.type('collections').get query
      .then (collections) ->
        options = collections.map (collection) -> {
            value: collection.id,
            label: collection.display_name,
            collection: collection
          }
        { options }

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
      loadOptions={@searchCollections}
    />
