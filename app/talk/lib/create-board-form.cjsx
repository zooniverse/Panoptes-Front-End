React = require 'react'
ROLES = require './roles'
talkClient = require '../../api/talk'

getUserRoleNames =  (user, section) ->
  talkClient.type('roles').get
    user_id: user.id,
    section: ['zooniverse', section],
    page_size: 100
  .then (roles) ->
    roles.map (role) -> role.name

mostPowerfulRole = (roleNames, rolesList) ->
  ROLES.filter((role) ->
    roleNames.indexOf(role) isnt -1
  )[0]

module?.exports = React.createClass
  displayName: 'CreateBoardForm'

  propTypes:
    section: React.PropTypes.string
    onSubmitBoard: React.PropTypes.func
    user: React.PropTypes.object

  getInitialState: ->
    error: ''
    mostPowerfulRole: null      # name of most powerful role

  componentWillMount: ->
    @setMostPowerfulRole()

  setMostPowerfulRole: ->
    {user, section} = @props
    getUserRoleNames(user, section).then (roleNames) =>
      @setState mostPowerfulRole: mostPowerfulRole(roleNames)

  roleDisplayLabels: (mostPowerfulRole) ->
    ROLES.slice(ROLES.indexOf(mostPowerfulRole), ROLES.length)

  onSubmitBoard: (e) ->
    e.preventDefault()
    titleInput = @getDOMNode().querySelector('form input')
    descriptionInput = @getDOMNode().querySelector('form textarea')

    # permissions
    read = @getDOMNode().querySelector(".roles-read input[name='role-read']:checked").value
    write = @getDOMNode().querySelector(".roles-write input[name='role-write']:checked").value
    permissions = {read, write}

    title = titleInput.value
    description = descriptionInput.value
    section = @props.section

    board = {title, description, section, permissions}

    return @setState({error: 'Boards must have a title and description'}) unless title and description

    talkClient.type('boards').create(board).save()
      .then (board) =>
        titleInput.value = ''
        descriptionInput.value = ''
        @setState({error: ''})
        @props.onSubmitBoard?(board)
      .catch (e) =>
        @setState {error: e.message}

  roleReadLabel: (roleName, i) ->
    <label key={i}><input type="radio" name="role-read" defaultChecked={i is ROLES.length-1} value={roleName}/>{roleName}</label>

  roleWriteLabel: (roleName, i) ->
    <label key={i}><input type="radio" name="role-write" defaultChecked={i is ROLES.length-1}value={roleName}/>{roleName}</label>

  render: ->
    <form onSubmit={@onSubmitBoard}>
      <h3>Add a board:</h3>
      <input type="text" ref="boardTitle" placeholder="Board Title"/>

      <textarea ref="boardDescription" placeholder="Board Description"></textarea><br />

      {if @state.mostPowerfulRole
        roleNames = @roleDisplayLabels(@state.mostPowerfulRole)
        <div>
          <h4>Can Read:</h4>
          <div className="roles-read">{roleNames.map(@roleReadLabel)}</div>

          <h4>Can Write:</h4>
          <div className="roles-write">{roleNames.map(@roleWriteLabel)}</div>
        </div>
      }

      <button type="submit"><i className="fa fa-plus-circle" /> Create Board</button>
      {if @state.error
        <p className="submit-error">{@state.error}</p>}
    </form>
