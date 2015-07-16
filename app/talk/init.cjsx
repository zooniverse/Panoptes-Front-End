React = require 'react'
BoardPreview = require './board-preview'
ActiveUsers = require './active-users'
talkClient = require '../api/talk'
PromiseRenderer = require '../components/promise-renderer'
HandlePropChanges = require '../lib/handle-prop-changes'
Moderation = require './lib/moderation'
ProjectLinker = require './lib/project-linker'
ROLES = require './lib/roles'
{Link} = require 'react-router'
Loading = require '../components/loading-indicator'
PopularTags = require './popular-tags'
require '../api/sugar'

DEFAULT_BOARD_TITLE = 'Notes'            # Name of board to put subject comments
DEFAULT_BOARD_DESCRIPTION = 'General comment threads about individual subjects'

module?.exports = React.createClass
  displayName: 'TalkInit'
  mixins: [HandlePropChanges]

  propTypes:
    section: React.PropTypes.string # 'zooniverse' for main-talk, 'project_id' for projects

  propChangeHandlers:
    'section': 'setBoards'

  getInitialState: ->
    boards: []
    loading: true

  componentWillMount: ->
    sugarClient.subscribeTo @props.section

  componentWillUnmount: ->
    sugarClient.unsubscribeFrom @props.section

  setBoards: ->
    talkClient.type('boards').get(section: @props.section)
      .then (boards) =>
        @setState {boards, loading: false}

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

  roleReadLabel: (data, i) ->
    <label key={i}><input type="radio" name="role-read" defaultChecked={i is ROLES.length-1} value={data}/>{data}</label>

  roleWriteLabel: (data, i) ->
    <label key={i}><input type="radio" name="role-write" defaultChecked={i is ROLES.length-1}value={data}/>{data}</label>

  createSubjectDefaultBoard: ->
    board =
      title: DEFAULT_BOARD_TITLE,
      description: DEFAULT_BOARD_DESCRIPTION
      subject_default: true,
      permissions: {read: 'all', write: 'all'}
      section: @props.section

    talkClient.type('boards').create(board).save()
      .then =>
        @setBoards()

  render: ->
    <div className="talk-home">
      {if @props.user?
        <Moderation section={@props.section} user={@props.user}>
          <div>
            <h2>Moderator Zone:</h2>
            {if @props.section isnt 'zooniverse'
              <PromiseRenderer promise={talkClient.type('boards').get({section: @props.section, subject_default: true}).index(0)}>{(defaultBoard) =>
                if not defaultBoard?
                  <button onClick={@createSubjectDefaultBoard}><i className="fa fa-photo" /> Activate Talk Subject Comments Board</button>
              }</PromiseRenderer>
              }

            <form onSubmit={@onSubmitBoard}>
              <h3>Add a board:</h3>
              <input type="text" ref="boardTitle" placeholder="Board Title"/>

              <textarea ref="boardDescription" placeholder="Board Description"></textarea><br />

              <h4>Can Read:</h4>
              <div className="roles-read">{ROLES.map(@roleReadLabel)}</div>

              <h4>Can Write:</h4>
              <div className="roles-write">{ROLES.map(@roleWriteLabel)}</div>

              <button type="submit"><i className="fa fa-plus-circle" /> Create Board</button>
            </form>
          </div>
        </Moderation>}

      <div className="talk-list-content">
        <section>
          {if @state.loading
            <Loading />
           else if @state.boards?.length is 0
            <p>There are currently no boards.</p>
           else if @state.boards?.length
             @state.boards.map(@boardPreview)}
        </section>

        <div className="talk-sidebar">
          <h2>Talk Sidebar</h2>

          <ProjectLinker />

          <section>
            <PopularTags
              header={<h3>Popular Tags:</h3>}
              section={@props.section}
              params={@props.params} />
          </section>

          <section>
            <ActiveUsers section={@props.section} />
          </section>
        </div>
      </div>
    </div>
