React = require 'react'
PromiseRenderer = require '../../components/promise-renderer'
apiClient = require '../../api/client'

ID_PREFIX = 'LAB_COLLABORATORS_PAGE_'

POSSIBLE_ROLES = [
  'collaborator'
  'expert'
  'scientist'
  'moderator'
  'tester'
  # 'translator'
]

ROLES_INFO =
  owner:
    label: 'Owner'
    description: 'The owner is the original project creator. There can be only one.'
  collaborator:
    label: 'Collaborator'
    description: 'Collaborators have full access to edit workflows and project content, including deleting some or all of the project.'
  expert:
    label: 'Expert'
    description: 'Experts can enter "gold mode" to make authoritative gold standard classifications that will be used to validate data quality.'
  scientist:
    label: 'Researcher'
    description: 'Members of the research team will be marked as scientists on "Talk"'
  moderator:
    label: 'Moderator'
    description: 'Moderators have extra privileges in the community discussion area to moderate discussions. They will also be marked as moderators on "Talk".'
  tester:
    label: 'Tester'
    description: 'Testers can view and classify on your project to give feedback while it’s still private. They cannot access the project builder.'
  translator:
    label: 'Translator'
    description: 'Translators will have access to the translation site.'

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
          Username:&emsp;<input type="text" ref="usernameInput" className="standard-input" />
        </p>

        <table className="standard-table">
          <tbody>
            {for role in POSSIBLE_ROLES
              <tr>
                <td><input id={ID_PREFIX + role} type="checkbox" name="role" value={role} /></td>
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
        if user?
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

        else
          throw new Error "User '#{username}' doesn't exist"

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
      <div className="form-label">Collaborators</div>

      <hr />

      {if @state.error?
        <p className="form-help error">{@state.error.toString()}</p>}
      <PromiseRenderer promise={@props.project.get 'project_roles'} then={(projectRoleSets) =>
        <div>
          {if projectRoleSets.length > 1
            for projectRoleSet in projectRoleSets
              <PromiseRenderer key={projectRoleSet.id} promise={projectRoleSet.get 'owner'} then={@renderUserRow.bind this, projectRoleSet} />
          else
            <em className="form-help">None yet</em>}
        </div>
      } />

      <hr />

      <div className="form-label">Add another</div>
      <CollaboratorCreator project={@props.project} onAdd={@handleCollaboratorAddition} />
    </div>

  renderUserRow: (projectRoleSet, user) ->
    console.log {user}, 'Owner', @props.owner
    if 'owner' in projectRoleSet.roles
      null
    else
      <p>
        <strong>{user.display_name}</strong>{' '}
        <button type="button" className="secret-button" onClick={@removeRoleSet.bind this, projectRoleSet}>&times;</button>
        <br />

        <span className="columns-container inline">
          {for role in POSSIBLE_ROLES
            toggleThisRole = @toggleRole.bind this, projectRoleSet, role
            # TODO: Translate this.
            <label key={role}>
              <input type="checkbox" name={role} checked={role in projectRoleSet.roles} disabled={role is 'owner' or projectRoleSet.id in @state.saving} onChange={toggleThisRole} />{' '}
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
    @props.project.uncacheLink 'project_roles'
    @forceUpdate()
