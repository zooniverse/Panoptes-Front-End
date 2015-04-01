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

CollaboratorCreator = React.createClass
  displayName: 'CollaboratorCreator'

  getDefaultProps: ->
    project: null

  getInitialState: ->
    error: null
    creating: false

  render: ->
    style = if @state.creating
      opacity: 0.5
      pointerEvents: 'none'

    <div>
      {if @state.error?
        <p className="form-help error">{@state.error.toString()}</p>}
      <form style={style}>
        <p>
          Username
          <br />

          <input type="text" ref="usernameInput" className="standard-input" />
          <br />

          <span className="column columns-container">
            {for role in POSSIBLE_ROLES
              <span key={role}>
                <label>
                  <input type="checkbox" name="role" value={role} />{' '}
                  {role[...1].toUpperCase()}{role[1...]}
                </label>
              </span>}
          </span>
          <br />

          <button type="submit" className="major-button" onClick={@handleSubmit}>Add user role</button>
        </p>
      </form>
    </div>

  handleSubmit: (e) ->
    e.preventDefault()

    usernameInput = @refs.usernameInput.getDOMNode()
    checkboxes = @getDOMNode().querySelectorAll '[name="role"]'

    username = @refs.usernameInput.getDOMNode().value
    roles = for checkbox in checkboxes when checkbox.checked
      checkbox.value

    @setState
      error: null
      creating: true

    getUser = apiClient.type('users').get display_name: username
      .then ([user]) =>
        newRoleSet = apiClient.type('project_roles').create
          roles: roles
          links:
            project: @props.project.id
            user: user.id

        newRoleSet.save().then =>
          usernameInput.value = ''
          for checkbox in checkboxes
            checkbox.checked = false
          @props.onAdd? arguments...

      .catch (error) =>
        @setState error: error

      .then =>
        @setState creating: false

module.exports = React.createClass
  displayName: 'EditProjectCollaborators'

  getDefaultProps: ->
    project: null

  getInitialState: ->
    error: null
    saving: []

  render: ->
    <div>
      <p>Collaborators</p>
      <hr />
      {if @state.error?
        <p className="form-help error">{@state.error.toString()}</p>}
      <PromiseRenderer promise={@props.project.get 'project_roles'} then={(projectRoleSets) =>
        <div>
          {for projectRoleSet in projectRoleSets
            <PromiseRenderer key={projectRoleSet.id} promise={projectRoleSet.get 'owner'} then={@renderUserRow.bind this, projectRoleSet} />}
        </div>
      } />
      <hr />
      <p>Add another</p>
      <CollaboratorCreator project={@props.project} onAdd={@handleCollaboratorAddition} />
    </div>

  renderUserRow: (projectRoleSet, user) ->
    <p>
      <strong>{user.display_name}</strong>{' '}
      <button type="button" className="secret-button" onClick={@removeRoleSet.bind this, projectRoleSet}>&times;</button>
      <br />

      <span className="columns-container inline">
        {for role in POSSIBLE_ROLES
          toggleThisRole = @toggleRole.bind this, projectRoleSet, role
          # TODO: Translate this.
          <label key={role}>
            <input type="checkbox" name={role} checked={role in projectRoleSet.roles} disabled={projectRoleSet.id in @state.saving} onChange={toggleThisRole} />{' '}
            {role[...1].toUpperCase()}{role[1...]}
          </label>}
      </span>
    </p>

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

  handleCollaboratorAddition: ->
    @project.uncacheLink 'project_roles'
    @forceUpdate()
