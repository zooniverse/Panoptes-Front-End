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
      .then (collections) =>
        opts = for col in collections
          { value: col.id, label: col.display_name, collection: col}
        callback null, {
          options: opts
        }

  render: ->
    <Select
      multi={@props.multi}
      name="colids"
      placeholder="Collection Name"
      searchPromptText="Type to search Collections"
      className="collection-search"
      closeAfterClick={true}
      onChange={@props.onChange}
      asyncOptions={debounce(@searchCollections, 200)} />
