React = require 'react'
PropTypes = require 'prop-types'
createReactClass = require 'create-react-class'
Select = require('react-select').default
{ collectionsSearch } = require('./searchCollections')

module.exports = createReactClass
  displayName: 'CollectionSearch'

  propTypes:
    multi: PropTypes.bool.isRequired
    onChange: PropTypes.func
    user: PropTypes.object

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
    collectionsSearch(value)
      .then (collections) =>
        options = collections.map (collection) =>
          {
            value: collection.id,
            label: @collectionDisplayName(collection),
            collection: collection
          }
        { options }

  collectionDisplayName: (collection) ->
    if collection.links.owner.id == @props.user.id
      # use the collection display name when the collection owner is the logged in user
      collection.display_name
    else
      # add the other collection owner name to help disambiguate this collection from the logged in user's
      collection.display_name + ' (' + collection.links.owner.display_name + ')'

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
