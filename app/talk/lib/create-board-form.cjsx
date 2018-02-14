React = require 'react'
PropTypes = require 'prop-types'
createReactClass = require 'create-react-class'
ReactDOM = require 'react-dom'
ROLES = require './roles'
talkClient = require 'panoptes-client/lib/talk-client'
SingleSubmitButton = require '../../components/single-submit-button'

getUserRoleNames =  (user, section) ->
  talkClient.type('roles').get
    user_id: user.id,
    section: ['zooniverse', section],
    page_size: 100
  .then (roles) ->
    roles.map (role) -> role.name

roleRankText =
  <span>
    Roles rank from most private to least private in the order: <strong>{ROLES.join(' > ')}</strong>
  </span>

module.exports = createReactClass
  displayName: 'CreateBoardForm'

  propTypes:
    section: PropTypes.string
    onSubmitBoard: PropTypes.func
    user: PropTypes.object

  getInitialState: ->
    error: ''
    admin: false

  componentWillMount: ->
    @setAdmin()

  setAdmin: ->
    {user, section} = @props
    getUserRoleNames(user, section).then (roleNames) =>
      admin = roleNames.indexOf('admin') isnt -1
      @setState {admin}

  roleNames: (admin) ->
    if admin then ROLES else ROLES.filter (role) -> role isnt 'admin'

  onSubmitBoard: (e) ->
    e.preventDefault()
    node = ReactDOM.findDOMNode(@)
    titleInput = node.querySelector('form input')
    descriptionInput = node.querySelector('form textarea')

    # permissions
    read = node.querySelector(".roles-read input[name='role-read']:checked").value
    write = node.querySelector(".roles-write input[name='role-write']:checked").value
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

      <div>
        {roleRankText}
        <h4>Can Read:</h4>
        <span>Users of this status or higher will be able to read content in this board</span>
        <div className="roles-read">{@roleNames(@state.admin).map(@roleReadLabel)}</div>

        <h4>Can Write:</h4>
        <span>Users of this status or higher will be able to post content in this board</span>
        <div className="roles-write">{@roleNames(@state.admin).map(@roleWriteLabel)}</div>
      </div>

      <SingleSubmitButton type="submit" onClick={@onSubmitBoard}><i className="fa fa-plus-circle" /> Create Board</SingleSubmitButton>
      {if @state.error
        <p className="submit-error">{@state.error}</p>}
    </form>
