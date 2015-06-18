React = require 'react'
Select = require 'react-select'
apiClient = require '../api/client'
debounce = require 'debounce'

module.exports = React.createClass
  displayName: 'UserSearch'

  getDefaultProps: ->
    multi: true

  searchUsers: (value, callback) ->
    unless value is ''
      apiClient.type('users').get display_name: "#{value}*", page_size: 10
        .then (users) =>
          opts = for user in users
            { value: user.id, label: "@#{ user.login }: #{ user.display_name }" }
          callback null, {
            options: opts
          }

  render: ->
    <Select
      multi={@props.multi}
      name="userids"
      placeholder="Username:"
      searchPromptText="Type to search Users"
      className="user-search"
      closeAfterClick={true}
      asyncOptions={debounce(@searchUsers, 200)} />
