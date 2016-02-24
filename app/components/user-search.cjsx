React = require 'react'
Select = require 'react-select'
apiClient = require 'panoptes-client/lib/api-client'

delayBy = (timeout, fn) ->
  setTimeout fn, timeout

module.exports = React.createClass
  displayName: 'UserSearch'

  getDefaultProps: ->
    multi: true
    debounce: 200

  queryTimeout: NaN

  searchUsers: (value) ->
    clearTimeout @queryTimeout

    if value is ''
      Promise.resolve options: []
    else
      new Promise (resolve) =>
        @queryTimeout = delayBy @props.debounce, =>
          apiClient.type('users').get search: value, page_size: 10
            .then (users) =>
              for user in users
                value: user.id
                label: "@#{user.login}: #{user.display_name}"
            .then (options) =>
              resolve {options}

  render: ->
    <Select
      multi={@props.multi}
      name="userids"
      placeholder="Username:"
      searchPromptText="Type to search Users"
      className="search standard-input"
      closeAfterClick={true}
      matchProp={'label'}
      asyncOptions={@searchUsers} />
