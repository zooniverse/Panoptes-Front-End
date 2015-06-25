React = require 'react'
Select = require 'react-select'
apiClient = require '../api/client'
debounce = require 'debounce'

module.exports = React.createClass
  displayName: 'CollectionSearch'

  getDefaultProps: ->
    multi: false
    favorite: false
    user: null
    project: null

  searchCollections: (value, callback) ->
    query =
      page_size: 10
      current_user_roles: 'owner,collaborator'
    query.display_name = "#{value}*" unless value is ''
    query.project_id = @props.project.id if @props.project?

    apiClient.type('collections').get query
      .then (collections) ->
        opts = collections.map (collection) -> {
          value: collection.id,
          label: collection.display_name
          collection: collection
        }

        callback null, {
          options: opts
        }

  options: ->
    return @refs.collectionSelect.state.options

  render: ->
    <Select
      ref="collectionSelect"
      multi={@props.multi}
      name="colids"
      placeholder="Collection Name"
      searchPromptText="Type to search Collections"
      className="collection-search"
      closeAfterClick={true}
      onChange={@props.onChange}
      asyncOptions={debounce(@searchCollections, 200)} />
