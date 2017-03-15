React = require 'react'
ReactDOM = require 'react-dom'
UserSearch = require '../components/user-search'
apiClient = require 'panoptes-client/lib/api-client'
checkIfCollectionOwner = require '../lib/check-if-collection-owner'

ID_PREFIX = 'COLLECTION_COLLABORATORS_PAGE_'

POSSIBLE_ROLES = [
  "owner",
  "collaborator",
  "contributor",
  "viewer"
]

ROLES_INFO =
  owner:
    label: "Owner"
    description: "The collection creator. There can only be one."
  collaborator:
    label: "Collaborator"
    description: "Collaborators have full access to add and remove subjects from the collection."
  contributor:
    label: "Contributor"
    description: "Contributors can only add subjects to the collection."
  viewer:
    label: "Viewer"
    description: "Viewers can see this collection even if it's private."

RoleCreator = React.createClass
  displayName: "RoleCreator"

  getDefaultProps: ->
    collection: null

  getInitialState: ->
    error: null
    creating: null

  render: ->
    style = if @state.creating
      opacity: 0.5
      pointerEvents: 'none'

    <div>
      {if @state.error?
        rawErrorMessage = @state.error.toString()

        errorMessage = switch
          when rawErrorMessage.indexOf('No User with id')
            'That user doesn\'t exist!'
          else
            'Error adding user.'

        <p className="form-help error">{errorMessage}</p>}
      <form style={style}>
        <div>
          <UserSearch ref={(component) => @userSearch = component} />
        </div>

        <table className="standard-table">
          <tbody>
            {for role in POSSIBLE_ROLES
              <tr key={role}>
                <td><input id={ID_PREFIX + role} type="checkbox" name="role" value={role} disabled={role is 'owner'}/></td>
                <td><strong><label htmlFor={ID_PREFIX + role}>{ROLES_INFO[role].label}</label></strong></td>
                <td>{ROLES_INFO[role].description}</td>
              </tr>}
          </tbody>
        </table>

        <p>
          <button type="submit" className="major-button" onClick={@handleSubmit}>Add user role</button>
        </p>
      </form>
    </div>

  handleSubmit: (e) ->
    e.preventDefault()
    node = ReactDOM.findDOMNode(@)

    checkboxes = node.querySelectorAll '[name="role"]'
    users = @userSearch.value().map (option) -> parseInt option.value
    roles = for checkbox in checkboxes when checkbox.checked
      checkbox.value

    @setState
      error: null
      creating: true

    roleSets = for id in users
      newRoleSet = apiClient.type('collection_roles').create
        roles: roles
        links:
          collection: @props.collection.id
          user: id

    Promise.all(roleSet.save() for roleSet in roleSets)
      .then =>
        @userSearch.clear()
        for checkbox in checkboxes
          checkbox.checked = false
        @props.onAdd? arguments...

      .catch (error) =>
        @setState error: error

      .then =>
        @setState creating: false

RoleRow = React.createClass
  displayName: "RoleRow"

  getDefaultProps: ->
    roleSet: null
    onRemove: Function.prototype

  getInitialState: ->
    saving: null
    owner: null

  componentDidMount: ->
    @props.roleSet.get('owner')
      .then (owner) =>
        @setState { owner }

  removeRoles: ->
    @updateRoles [], @props.onRemove

  toggleRole: (role) ->
    currentRoles = @props.roleSet.roles

    if role in currentRoles
      index = currentRoles.indexOf role
      currentRoles.splice index, 1
    else
      currentRoles.push role

    if currentRoles.length
      @updateRoles currentRoles
    else
      @removeRoles()

  updateRoles: (newRoles = [], callback = ->) ->
    @setState saving: true

    promise = if newRoles.length > 0
      @props.roleSet.update({ roles: newRoles }).save()
    else
      @props.roleSet.delete()

    promise
      .then =>
        callback()
        @setState saving: false
      .catch (error) =>
        @setState { error }

  render: ->
    { owner } = @state

    <p>
      {if owner
        <strong>{owner.login}</strong>}

      <button type="button" className="pill-button" onClick={@removeRoles}>Remove</button>
      <br />

      <span className="columns-container inline">
        {for role in POSSIBLE_ROLES
          <label key={role}>
            <input type="checkbox" name={role} checked={role in @props.roleSet.roles} disabled={role is 'owner' or @state.saving} onChange={@toggleRole.bind this, role} />{' '}
            {ROLES_INFO[role].label}
          </label>}
      </span>
    </p>

module.exports = React.createClass
  displayName: "CollectionCollaborators"

  getDefaultProps: ->
    collection: null

  getInitialState: ->
    error: null
    owner: null
    roleSets: []
    hasSettingsRole: false

  componentDidMount: ->
    checkIfCollectionOwner(@props.user, @props.collection)
      .then (hasSettingsRole) =>
        @setState {hasSettingsRole}
    @update()

  update: (callback = ->) ->
    promise = Promise.all [
      apiClient.type('collection_roles').get(collection_id: @props.collection.id),
      @props.collection.get('owner')
    ]

    promise.then ([roleSets, owner]) =>
      @setState { roleSets, owner }, callback

  handleCollaboratorChange: ->
    @props.collection.uncacheLink 'collection_roles'
    @update()

  render: ->
    if @state.hasSettingsRole
      { roleSets, owner } = @state

      <div className="collection-settings-tab">
        {if @state.error?
          <p className="form-help error">{@state.error.toString()}</p>}

        {if roleSets.length is 1
          <div className="helpful-tip">None yet, add some with the form below.</div>}

        {if owner and roleSets.length > 1
          <div>
            {for roleSet in roleSets
              continue if owner.id is roleSet.links.owner.id
              <RoleRow key={roleSet.id} roleSet={roleSet} onRemove={@handleCollaboratorChange} />}
          </div>}

        <br />
        <hr />
        <br />

        <div className="form-label">Add a collaborator</div>
        <RoleCreator collection={@props.collection} onAdd={@handleCollaboratorChange} />
      </div>
    else
      <div className="collection-settings-tab">
        <p>Not allowed to edit this collection</p>
      </div>
