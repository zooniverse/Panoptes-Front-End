React = require 'react'
PromiseRenderer = require '../../components/promise-renderer'
apiClient = require '../../api/client'

POSSIBLE_ROLES = [
  'owner'
  'collaborator'
  'moderator'
  'scientist'
  'tester'
  'translator'
]

module.exports = React.createClass
  displayName: 'EditProjectCollaborators'

  getDefaultProps: ->
    project: null

  getInitialState: ->
    error: null
    saving: []

  render: ->
    <div className="content-container">
      <p>Collaborators</p>

      {if @state.error?
        <p className="form-help error">{@state.error.toString()}</p>}

      <PromiseRenderer promise={@props.project.get 'project_roles'} then={(projectRoleSets) =>
        <div className="fake-table standard-table">
          {for projectRoleSet in projectRoleSets
            <PromiseRenderer promise={projectRoleSet.get 'owner'} then={@renderUserRow.bind this, projectRoleSet} />}
          {@renderAddUserRow()}
        </div>
      } />
    </div>

  renderUserRow: (projectRoleSet, user) ->
    <div className="fake-tr">
      <div className="fake-td">
        {user.display_name}
      </div>

      {for role in POSSIBLE_ROLES
        toggleThisRole = @toggleRole.bind this, projectRoleSet, role
        # TODO: Translate this.
        <label className="fake-td">
          <input type="checkbox" name={role} checked={role in projectRoleSet.roles} disabled={projectRoleSet.id in @state.saving} onChange={toggleThisRole} />{' '}
          {role[...1].toUpperCase()}{role[1...]}
        </label>}

      <div className="fake-td">
        <button type="button" onClick={@removeRoleSet.bind this, projectRoleSet}>&times;</button>
      </div>
    </div>

  toggleRole: (projectRoleSet, role) ->
    index = projectRoleSet.roles.indexOf role

    if index is -1
      projectRoleSet.roles.push role
    else
      projectRoleSet.roles.splice index, 1

    @state.saving.push projectRoleSet.id

    @setState
      error: null
      saving: @state.saving

    projectRoleSet.update('roles').save()
      .catch (error) =>
        @setState {error}
      .then =>
        savingIndex = @state.saving.indexOf projectRoleSet.id
        @state.saving.splice savingIndex, 1
        @setState saving: @state.saving

  removeRoleSet: (projectRoleSet) ->
    @state.saving.push projectRoleSet.id

    @setState
      error: null
      saving: @state.saving

    projectRoleSet.delete()
      .catch (error) =>
        @setState {error}

      .then =>
        @props.project.uncacheLink 'project_roles'

        savingIndex = @state.saving.indexOf projectRoleSet.id
        @state.saving.splice savingIndex, 1
        @setState saving: @state.saving

  renderAddUserRow: ->
    style =
      opacity: if @state.addingUser then '0.5' else ''

    <div className="fake-tr" style={style}>
      <div className="fake-td">
        <input type="text" className="new-role-user" />
      </div>

      {for role in POSSIBLE_ROLES
        <label className="fake-td">
          <input type="checkbox" className="new-role" name="new-role" value={role} />{' '}
          {role[...1].toUpperCase()}{role[1...]}
        </label>}

      <div className="fake-td">
        <button type="button" onClick={@handleAddUser}>+</button>
      </div>
    </div>

  handleAddUser: ->
    node = @getDOMNode()

    username = node.querySelector('.new-role-user').value
    roles = for checkbox in node.querySelectorAll '.new-role' when checkbox.checked
      checkbox.value

    @setState addingUser: true

    getUser = apiClient.type('users').get display_name: username
      .then ([user]) =>
        newRoleSet = apiClient.type('project_roles').create
          roles: roles
          links:
            project: @props.project.id
            user: user.id

        newRoleSet.save().then =>
          @props.project.uncacheLink 'project_roles'

      .catch (error) =>
        @setState errorAddingUser: error

      .then =>
        @setState addingUser: false
