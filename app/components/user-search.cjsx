React = require 'react'
Select = require 'react-select'
PromiseRenderer = require './promise-renderer'
apiClient = require '../api/client'
debounce = require 'debounce'

module.exports = React.createClass
  displayName: 'UserSearch'

  searchUsers: (value, callback) ->
    unless value is ''
      apiClient.type('users').get display_name: value, page_size: 10
        .then (users) =>
          opts = for user in users
            { value: user.id, label: "@#{ user.login }: #{ user.display_name }" }
          callback null, {
            options: opts
          }

  render: ->
    <Select
      multi={true}
      name="userids"
      placeholder="Username:"
      searchPromptText="Type to Search Users"
      className="user-search"
      closeAfterClick={true}
      asyncOptions={debounce(@searchUsers, 200)} />
