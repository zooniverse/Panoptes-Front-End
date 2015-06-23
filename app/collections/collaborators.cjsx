React = require 'react'
PromiseRenderer = require '../components/promise-renderer'
UserSearch = require '../components/user-search'
apiClient = require '../api/client'
counterpart = require 'counterpart'
{Translate} = require 'react-translate-component'

ID_PREFIX = 'COLLECTION_COLLABORATORS_PAGE_'

POSSIBLE_ROLES = [
  "owner",
  "collaborator",
  "viewer"
]

ROLES_INFO =
  owner:
    label: "Owner"
    description: "The colleciton creator. There can only be one."
  collaborator:
    label: "Collaborator"
    description: "Collaborators have full access to add and remove subjects from the collection."
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
        <p className="form-help error">{@state.error.toString()}</p>}
      <form style={style}>
        <p>
          <UserSearch />
        </p>

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
    checkboxes = @getDOMNode().querySelectorAll '[name="role"]'
    userids = @getDOMNode().querySelector('[name="userids"]')
    users = userids.value.split(',').map (id) -> parseInt(id)
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
        userids.value = ''
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

  getInitialState: ->
    saving: null

  removeRoleSet: ->
    @props.roleSet.destroy()

  toggleThisRole: (role) ->
    index = @props.roleSet.roles.indexOf role

    @setState
      saving: true

    if index is -1
      @props.roleSet.roles.push role
    else
      @props.roleSet.roles.splice index, 1

    @props.roleSet.save()
      .catch (error) =>
        @setState {error}
      .then =>
        @state.saving = false
        @setState saving: @state.saving

  render: ->
    <PromiseRenderer promise={@props.roleSet.get 'owner'}>{(owner) =>
      <p>
        <strong>{owner.display_name}</strong>{' '}
        <button type="button" className="secret-button" onClick={@removeRoleSet}>&times;</button>
        <br />

        <span className="columns-container inline">
          {for role in POSSIBLE_ROLES
            # TODO: Translate this.
            <label key={role}>
              <input type="checkbox" name={role} checked={role in @props.roleSet.roles} disabled={role is 'owner' or @state.saving} onChange={@toggleThisRole.bind this, role} />{' '}
              {ROLES_INFO[role].label}
            </label>}
        </span>
      </p>
    }</PromiseRenderer>

module.exports = React.createClass
  displayName: "CollectionCollaborators"

  getDefaultProps: ->
    collection: null

  getInitialState: ->
    error: null

  getRoles: ->
    apiClient.type('collection_roles').get(collection_id: @props.collection.id)

  render: ->
    <div className="collection-settings-tab">
      {if @state.error?
        <p className="form-help error">{@state.error.toString()}</p>}
      <PromiseRenderer promise={@getRoles()}>{(roleSets) =>
        <div>
          {ownerSet = roleSets.filter((set) -> 'owner' in set.roles)[0]
          <RoleRow key={ownerSet.id} roleSet={ownerSet} />}
          {if roleSets.length > 1
            for roleSet in roleSets when 'owner' not in roleSet.roles
              <RoleRow key={roleSet.id} roleSet={roleSet} />
          else
            <em className="form-help">None yet</em>}
        </div>
      }</PromiseRenderer>

      <hr />

      <div className="form-label">Add another</div>
      <RoleCreator collection={@props.collection} onAdd={@handleCollaboratorAddition} />
    </div>

  handleCollaboratorAddition: ->
    @props.collection.uncacheLink 'collection_roles'
    @forceUpdate()
