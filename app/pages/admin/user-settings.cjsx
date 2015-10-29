React = require 'react'
ReactDOM = require 'react-dom'
UserSearch = require '../../components/user-search'
PromiseRenderer = require '../../components/promise-renderer'
apiClient = require '../../api/client'
{Link} = require 'react-router'
moment = require 'moment'
ChangeListener = require '../../components/change-listener'
AutoSave = require '../../components/auto-save'
handleInputChange = require '../../lib/handle-input-change'
SetToggle = require '../../lib/set-toggle'

UserSettings = React.createClass
  displayName: "User Settings"

  getDefaultProps: ->
    editUser: null

  render: ->
    if @props.editUser
      <div className="project-status">
        <h4>Settings for { @props.editUser.login }</h4>
        <ul>
          <li>Admin: <UserCheckboxToggle editUser={@props.editUser} field="admin" disabled /></li>
          <li>Login prompt: <UserCheckboxToggle editUser={@props.editUser} field="login_prompt" disabled /></li>
          <li>Private profile: <UserCheckboxToggle editUser={@props.editUser} field="private_profile" disabled /></li>
          <li>Uploaded subjects: { @props.editUser.uploaded_subjects_count }</li>
          <li><UserLimitToggle editUser={@props.editUser} /> </li>
        </ul>
      </div>
    else
      <div>No user found</div>

UserCheckboxToggle = React.createClass
  displayName: "User Checkbox Toggle"

  mixins: [SetToggle]

  getDefaultProps: ->
    editUser: null
    field: null

  getInitialState: ->
    error: null
    setting: {}

  setterProperty: 'user'

  render: ->
    editUser = @props.editUser
    setting = editUser[@props.field]
    <label style={whiteSpace: 'nowrap'}>
      <input type="checkbox" disabled={@props.disabled} name={@props.field} value={setting} checked={setting} onChange={@set.bind this, @props.field, not setting} />
    </label>

UserLimitToggle = React.createClass
  displayName: "User limit toggle"

  mixins: [SetToggle]

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
        <span className="form-label">Subject Limit:</span>
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
