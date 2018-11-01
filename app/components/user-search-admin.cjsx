React = require 'react'
PropTypes = require 'prop-types'
createReactClass = require 'create-react-class'
Select = require('react-select').default
apiClient = require 'panoptes-client/lib/api-client'

delayBy = (timeout, fn) ->
  setTimeout fn, timeout

module.exports = createReactClass
  displayName: 'UserSearchAdmin'

  queryTimeout: NaN

  propTypes:
    multi: PropTypes.bool
    debounce: PropTypes.number
    isAdminUser: PropTypes.bool

  getDefaultProps: ->
    multi: true
    debounce: 200
    isAdminUser: false
    matchProp: 'label'

  getInitialState: ->
    users: []

  onChange: (users) ->
    @setState {users}

  clear: ->
    @setState users: []

  value: ->
    @state.users

  filterOptions: (options, filter, currentValues)->
    options

  searchUsers: (value) ->
    clearTimeout @queryTimeout
    onSearch = @props.onSearch
    valueLikeEmail = value.match /.+@.+\..+/
    userSearchParams = {}

    if value is ''
      return Promise.resolve options: []
    else if @props.isAdminUser && valueLikeEmail
      userSearchParams = { email: value, admin: true, page_size: 1 }
    else
      userSearchParams = { search: value, page_size: 10 }

    new Promise (resolve) =>
      @queryTimeout = delayBy @props.debounce, =>
        onSearch() if onSearch
        apiClient.type('users').get(userSearchParams)
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
      filterOptions={@filterOptions}
      loadOptions={@searchUsers} />
