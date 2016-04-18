React = require 'react'
ReactDOM = require 'react-dom'
UserSearch = require '../../components/user-search'
PromiseRenderer = require '../../components/promise-renderer'
apiClient = require 'panoptes-client/lib/api-client'
AutoSave = require '../../components/auto-save'
handleInputChange = require '../../lib/handle-input-change'

UserSettings = React.createClass
  displayName: "User Settings"

  getDefaultProps: ->
    editUser: null

  componentDidMount: ->
    @_boundForceUpdate ?= @forceUpdate.bind this
    @props.editUser?.listen 'change', @_boundForceUpdate

  componentWillReceiveProps: (nextProps) ->
    @props.editUser?.stopListening 'change', @_boundForceUpdate
    nextProps.editUser.listen 'change', @_boundForceUpdate

  render: ->
    if @props.editUser?
      handleChange = handleInputChange.bind @props.editUser

      <div className="project-status">
        <h4>Settings for {@props.editUser.login}</h4>
        <ul>
          <li>
            <AutoSave resource={@props.editUser}>
              <input type="checkbox" name="admin" checked={@props.editUser.admin} disabled onChange={handleChange} />{' '}
              Admin
            </AutoSave>
          </li>
          <li>
            <AutoSave resource={@props.editUser}>
              <input type="checkbox" name="login_prompt" checked={@props.editUser.login_prompt} disabled onChange={handleChange} />{' '}
              Login prompt
            </AutoSave>
          </li>
          <li>
            <AutoSave resource={@props.editUser}>
              <input type="checkbox" name="private_profile" checked={@props.editUser.private_profile} disabled onChange={handleChange} />{' '}
              Private profile
            </AutoSave>
          </li>
          <li>
            <AutoSave resource={@props.editUser}>
              <input type="checkbox" name="upload_whitelist" checked={@props.editUser.upload_whitelist} onChange={handleChange} />{' '}
              Whitelist subject uploads
            </AutoSave>
          </li>
        </ul>

        <ul>
          <li>Uploaded subjects: {@props.editUser.uploaded_subjects_count}</li>
          <li><UserLimitToggle editUser={@props.editUser} /></li>
        </ul>
      </div>

    else
      <div>No user found</div>

UserLimitToggle = React.createClass
  displayName: "User limit toggle"

  getDefaultProps: ->
    editUser: null
    invalidLimit: "invalidLimit"

  getInitialState: ->
    error: null

  validLimit: (limit) ->
    if limit == ""
      false
    else
      n = ~ ~Number(limit)
      String(n) == limit and n >= 0

  updateLimit: (e) ->
    _subject_limit = this.refs.subjectLimit.value
    if @validLimit(_subject_limit)
      handleInputChange.call(@props.editUser, e)
    else
      @setState(error: @props.invalidLimit)

  errorMessage: ->
    if @state.error == @props.invalidLimit
      "Must be a positive integer"
    else if @state.error == @props.invalidLimit
      "kasjdhkdjshf"

  render: ->
    <div>
      <AutoSave resource={@props.editUser}>
        Subject Limit:{' '}
        <input type="number" name="subject_limit" min="1" ref="subjectLimit" value={@props.editUser.max_subjects} onBlur={@updateLimit} onChange={handleInputChange.bind @props.editUser} />
        <span>{ @errorMessage() }</span>
      </AutoSave>
    </div>

module.exports = React.createClass
  displayName: "User Settings List"

  getInitialState: ->
    userId: null
    editUser: null

  listUsers: (e) ->
    e.preventDefault()
    userSelect = ReactDOM.findDOMNode(@).querySelector('[name="userids"]')
    userId = userSelect.value
    if userId?
      this.setState({userId: userId});
      @forceUpdate()

  render: ->
    <div>
      <div className="columns-container">
        <div className="column">
          <UserSearch multi={false} />
        </div>
        <button type="button" onClick={@listUsers}>
          Find user
        </button>
      </div>
      { if @state.userId?
        <PromiseRenderer promise={apiClient.type('users').get(@state.userId)}>{(editUser) =>
          if editUser == @props.user
            <p>Can't edit your own account</p>
          else if editUser?
            <UserSettings editUser={editUser} />
        }</PromiseRenderer>}
    </div>
