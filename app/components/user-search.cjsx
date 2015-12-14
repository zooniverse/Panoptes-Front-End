React = require 'react'
Select = require 'react-select'
apiClient = require '../api/client'
debounce = require 'debounce'

module.exports = React.createClass
  displayName: 'UserSearch'

  getDefaultProps: ->
    multi: true

  searchUsers: (value, callback) ->
    if value is ''
      callback null, {}
    else
      apiClient.type('users').get search: "#{value}", page_size: 10
        .then (users) =>
          opts = for user in users
            { value: user.id, label: "@#{ user.login }: #{ user.display_name }" }
          { options: opts }

  render: ->
    <Select
      multi={@props.multi}
      name="userids"
      placeholder="Username:"
      searchPromptText="Type to search Users"
      className="search standard-input"
      closeAfterClick={true}
      asyncOptions={debounce(@searchUsers, 200)} />
