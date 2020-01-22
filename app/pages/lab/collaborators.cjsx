React = require 'react'
createReactClass = require 'create-react-class'
ReactDOM = require 'react-dom'
PromiseRenderer = require '../../components/promise-renderer'
UserSearch = require '../../components/user-search'
apiClient = require 'panoptes-client/lib/api-client'
talkClient = require 'panoptes-client/lib/talk-client'
projectSection = require '../../talk/lib/project-section'
isAdmin = require '../../lib/is-admin'
getAllLinked = require('../../lib/get-all-linked').default

ID_PREFIX = 'LAB_COLLABORATORS_PAGE_'

POSSIBLE_ROLES = {
  collaborator: 'admin',
  expert: 'team',
  scientist: 'scientist',
  moderator: 'moderator',
  tester: 'team'
}

# NOTE: Panoptes API and Talk API keep track of user roles separately; Panoptes can accept arbitrary role values, but Talk API can't.
# The key-value pairs of POSSIBLE_ROLES maps the roles on Panoptes API (key) to the 'comparable' roles on Talk API.

ROLES_INFO =
  collaborator:
    label: 'Collaborator'
    description: 'Collaborators have full access to edit workflows and project content, including deleting some or all of the project.'
  expert:
    label: 'Expert'
    description: 'Experts can enter "gold mode" to make authoritative gold standard classifications that will be used to validate data quality.'
  scientist:
    label: 'Researcher'
    description: 'Members of the research team will be marked as researchers on "Talk"'
  moderator:
    label: 'Moderator'
    description: 'Moderators have extra privileges in the community discussion area to moderate discussions. They will also be marked as moderators on "Talk".'
  tester:
    label: 'Tester'
    description: 'Testers can view and classify on your project to give feedback while it’s still private. If given the direct url, they can also view and classify on inactive workflows; this is useful for already launched projects that are planning on building a new workflow and woud like volunteer feedback. Testers cannot access the project builder.'
  translator:
    label: 'Translator'
    description: 'Translators will have access to the translation site.'
  museum:
    label: 'Museum'
    description: 'Enables a custom interface for the project on the Zooniverse iPad app, specifically designed to be used in a museum or exhibit space.'
    
ROLES_NOT_IN_TALK_API = [
  'museum'
]

CollaboratorCreator = createReactClass
  displayName: 'CollaboratorCreator'

  getDefaultProps: ->
    project: null

  getInitialState: ->
    error: null
    creating: false

  render: ->
    @showTranslatorRole()
    @showMuseumRole()

    style = if @state.creating
      opacity: 0.5
      pointerEvents: 'none'

    <div>
      {if @state.error?
        <p className="form-help error">{@state.error.toString()}</p>}
      <form style={style}>
        <div>
          <UserSearch ref={(component) => @userSearch = component} />
        </div>

        <table className="standard-table">
          <tbody>
            {for role, label of POSSIBLE_ROLES
              <tr key={role + '-' + label}>
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

  showTranslatorRole: ->
    if (@props.project.experimental_tools?.indexOf('translator-role') > -1) or isAdmin()
      POSSIBLE_ROLES = Object.assign({}, POSSIBLE_ROLES, {translator: 'translator'});
  
  showMuseumRole: ->
    if (@props.project.experimental_tools?.indexOf('museum-role') > -1) or isAdmin()
      POSSIBLE_ROLES = Object.assign({}, POSSIBLE_ROLES, {museum: 'museum'});

  handleSubmit: (e) ->
    e.preventDefault()
    node = ReactDOM.findDOMNode(@)
    checkboxes = node.querySelectorAll '[name="role"]'
    users = @userSearch.value().map (option) -> parseInt option.value
    roles = for checkbox in checkboxes when checkbox.checked
      checkbox.value

    talkRoles = for role, talkRole of POSSIBLE_ROLES when role in roles and role not in ROLES_NOT_IN_TALK_API 
      talkRole

    talkRoles = talkRoles.reduce(((memo, role) ->
      memo.push(role) unless role in memo
      memo
    ), [])

    @setState
      error: null
      creating: true

    newRoles = users.reduce(((memo, id) =>
      newRoleSet = apiClient.type('project_roles').create
        roles: roles
        links:
          project: @props.project.id
          user: id

      newTalkRoleSets = for role in talkRoles
        talkClient.type('roles').create
          name: role
          section: projectSection(@props.project)
          user_id: id

      memo.concat([newRoleSet]).concat(newTalkRoleSets)
    ), [])

    Promise.all(roleSet.save() for roleSet in newRoles)
      .then =>
        @userSearch.clear()
        for checkbox in checkboxes
          checkbox.checked = false
        @props.onAdd? arguments...

      .catch (error) =>
        if error.message.match /not allowed to create this role/i
          error.message = 'Your account status on this project is still being setup. Please try again later.'

        @setState {error}

      .then =>
        @setState creating: false

module.exports = createReactClass
  displayName: 'EditProjectCollaborators'

  getDefaultProps: ->
    project: null

  getInitialState: ->
    error: null
    saving: []

  fetchAllRoles: ->
    Promise.all([getAllLinked(@props.project, 'project_roles'), talkClient.type('roles').get(section: @talkSection(), page_size: 100)])
      .then ([panoptesRoles, talkRoles]) ->
        for roleSet in panoptesRoles when roleSet.links.owner.type == 'users'
          roleSet['talk_roles'] = talkRoles.filter((role) -> role.links.user == roleSet.links.owner.id)
          roleSet

  render: ->
    <div>
      <div className="form-label">Project Owner</div>
      <PromiseRenderer promise={@props.project.get('owner')} then={(projectOwner) =>
        projectOwnerMessage = if @props.user.id is projectOwner.id
          'You are the project owner.'
        else
          projectOwner.display_name + ' is the project owner.'

        <p>
          {projectOwnerMessage}
        </p>
      } />

      <br />

      <div className="form-label">Collaborators</div>

      <hr />

      {if @state.error?
        <p className="form-help error">{@state.error.toString()}</p>}

      <PromiseRenderer promise={@fetchAllRoles()} then={(projectRoleSets) =>
        <div>
          {if projectRoleSets.length > 1
            for projectRoleSet in projectRoleSets when 'owner' not in projectRoleSet.roles
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
    <p>
      <strong>{user.display_name}</strong>{' '}
      <button type="button" className="secret-button" onClick={@removeRoleSet.bind this, projectRoleSet}>&times;</button>
      <br />

      <span className="columns-container inline">
        {for role, _ of POSSIBLE_ROLES
          toggleThisRole = @toggleRole.bind this, projectRoleSet, role
          # TODO: Translate this.
          <label key={role}>
            <input type="checkbox" name={role} checked={role in projectRoleSet.roles} disabled={role is 'owner' or projectRoleSet.id in @state.saving} onChange={toggleThisRole} />{' '}
            {ROLES_INFO[role].label}
          </label>}
      </span>
    </p>

  toggleRole: (projectRoleSet, role) ->
    index = projectRoleSet.roles.indexOf role

    @state.saving.push projectRoleSet.id

    @setState
      error: null
      saving: @state.saving

    talkRoleAction = if index is -1
      projectRoleSet.roles.push role
      talkClient.type('roles').create(
        user_id: parseInt(projectRoleSet.links.owner.id)
        section: @talkSection()
        name: POSSIBLE_ROLES[role]
      ).save() unless role in ROLES_NOT_IN_TALK_API 
    else
      projectRoleSet.roles.splice index, 1
      filteredRoles = projectRoleSet.talk_roles.filter (talkRole) ->
        talkRole.name is POSSIBLE_ROLES[role]
      filteredRoles[0]?.delete()

    Promise.all([projectRoleSet.update('roles').save(), talkRoleAction])
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

    Promise.all([projectRoleSet.delete(), talkRole.delete() for talkRole in projectRoleSet.talk_roles])
      .catch (error) =>
        @setState {error}

      .then =>
        @props.project.uncacheLink 'project_roles'

        savingIndex = @state.saving.indexOf projectRoleSet.id
        @state.saving.splice savingIndex, 1
        @setState saving: @state.saving

  talkSection: ->
    projectSection(@props.project)

  handleCollaboratorAddition: ->
    @props.project.uncacheLink 'project_roles'
    @forceUpdate()
