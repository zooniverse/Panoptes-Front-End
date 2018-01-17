React = require 'react'
PropTypes = require 'prop-types'
createReactClass = require 'create-react-class'
Select = require('react-select').default
apiClient = require 'panoptes-client/lib/api-client'

delayBy = (timeout, fn) ->
  setTimeout fn, timeout

module.exports = createReactClass
  displayName: 'UserSearch'

  queryTimeout: NaN

  propTypes:
    multi: PropTypes.bool
    debounce: PropTypes.number

  getDefaultProps: ->
    multi: true
    debounce: 200

  getInitialState: ->
    users: []

  onChange: (users) ->
    @setState {users}

  clear: ->
    @setState users: []

  value: ->
    @state.users

  searchUsers: (value) ->
    clearTimeout @queryTimeout
    onSearch = @props.onSearch

    if value is ''
      Promise.resolve options: []
    else
      new Promise (resolve) =>
        @queryTimeout = delayBy @props.debounce, =>
          onSearch() if onSearch
          apiClient.type('users').get search: value, page_size: 10
            .then (users) =>
              for user in users
                value: user.id
                label: "@#{user.login}: #{user.display_name}"
            .then (options) =>
              resolve {options}

  render: ->
    <Select.Async
      multi={@props.multi}
      name="userids"
      value={@state.users}
      onChange={@onChange}
      placeholder="Username:"
      searchPromptText="Type to search Users"
      className="search standard-input"
      closeAfterClick={true}
      matchProp={'label'}
      loadOptions={@searchUsers} />
