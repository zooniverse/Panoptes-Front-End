React = require 'react'
BoardPreview = require './board-preview'
talkClient = require '../api/talk'
authClient = require '../api/auth'
ChangeListener = require '../components/change-listener'
PromiseRenderer = require '../components/promise-renderer'
Moderation = require './lib/moderation'
ChangeListener = require '../components/change-listener'
PromiseRenderer = require '../components/promise-renderer'
ProjectLinker = require './lib/project-linker'
ROLES = require './lib/roles'
auth = require '../api/auth'

module?.exports = React.createClass
  displayName: 'TalkInit'

  getInitialState: ->
    boards: []

  propTypes:
    section: React.PropTypes.string # 'zooniverse' for main-talk, 'project_id' for projects

  componentWillMount: ->
    @setBoards()

  setBoards: ->
    auth.checkCurrent().then =>
      talkClient.type('boards').get(section: @props.section)
        .then (boards) =>
          @setState {boards}

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
    return console.log "failed validation" unless title and description and section

    talkClient.type('boards').create(board).save()
      .then (board) =>
        titleInput.value = ''
        descriptionInput.value = ''
        @setBoards()

  boardPreview: (data, i) ->
    <BoardPreview {...@props} key={i} data={data} />

  tag: (t, i) ->
    <p key={i}>#{t.name}</p>

  roleReadLabel: (data, i) ->
    <label key={i}><input type="radio" name="role-read" value={data}/>{data}</label>

  roleWriteLabel: (data, i) ->
    <label key={i}><input type="radio" name="role-write" value={data}/>{data}</label>

  render: ->
    <div className="talk-home">
      <Moderation>
        <form onSubmit={@onSubmitBoard}>
          <h2>Moderator Zone:</h2>
          <h3>Add a board:</h3>
          <input type="text" ref="boardTitle" placeholder="Board Title"/>

          <textarea type="text" ref="boardDescription" placeholder="Board Description"></textarea><br />

          <h4>Can Read:</h4>
          <div className="roles-read">{ROLES.map(@roleReadLabel)}</div>

          <h4>Can Write:</h4>
          <div className="roles-write">{ROLES.map(@roleWriteLabel)}</div>

          <button type="submit"><i className="fa fa-plus-circle" /> Create Board</button>
        </form>
      </Moderation>

      <div className="talk-list-content">
        <section>
          {if @state.boards.length
            @state.boards.map(@boardPreview)
           else
            <p>There are currently no boards.</p>}
        </section>

        <div className="talk-sidebar">
          <h2>Talk Sidebar</h2>

          <h3>Jump to a project</h3>
          <ProjectLinker />

          <PromiseRenderer promise={talkClient.type('tags').get(section: @props.section)}>{(tags) =>
            if tags.length
              <section>
                <h3>Latest Tags:</h3>
                {tags.map(@tag)}
              </section>
          }</PromiseRenderer>
        </div>
      </div>
    </div>
