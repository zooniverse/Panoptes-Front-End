React = require 'react'
PropTypes = require 'prop-types'
createReactClass = require 'create-react-class'
Select = require('react-select').default
apiClient = require 'panoptes-client/lib/api-client'

module.exports = createReactClass
  displayName: 'CollectionSearch'

  propTypes:
    multi: PropTypes.bool.isRequired
    onChange: PropTypes.func

  componentDidMount: ->
    if @props.autoFocus
      @refs.collectionSelect.focus()
    

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
      page_size: 100
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
