React = require 'react'
BoardPreview = require './board-preview'
talkClient = require '../api/talk'
authClient = require '../api/auth'
ChangeListener = require '../components/change-listener'
PromiseRenderer = require '../components/promise-renderer'
Moderation = require './lib/moderation'
ChangeListener = require '../components/change-listener'
PromiseRenderer = require '../components/promise-renderer'

module?.exports = React.createClass
  displayName: 'TalkInit'

  getInitialState: ->
    boards: []
    discussionsMeta: {}

  propTypes:
    section: React.PropTypes.string # 'zooniverse' for main-talk, 'project_id' for projects

  componentWillMount: ->
    @setBoards()
    @setDiscussionsMeta()

  setBoards: ->
    talkClient.type('boards').get(section: @props.section)
      .then (boards) =>
        @setState {boards}
      .catch (e) =>
        console.log "error getting boards"

  setDiscussionsMeta: ->
    talkClient.type('discussions').get(section: @props.section)
      .then (discussions) =>
        @setState {discussionsMeta: discussions[0]?.getMeta()}
      .catch (e) =>
        console.log 'Error setting discussions meta'

  onSubmitBoard: (e) ->
    e.preventDefault()
    titleInput = @getDOMNode().querySelector('form input')
    descriptionInput = @getDOMNode().querySelector('form textarea')

    title = titleInput.value
    description = descriptionInput.value
    section = @props.section

    board = {title, description, section}
    return console.log "failed validation" unless title and description and section

    talkClient.type('boards').create(board).save()
      .then (board) =>
        titleInput.value = ''
        descriptionInput.value = ''
        console.log "board save successul", board
        @setBoards()
      .catch (e) =>
        console.log "error saving board", e

  boardPreview: (data, i) ->
    <BoardPreview {...@props} key={i} data={data} />

  tag: (t, i) ->
    <p>#{t.name}</p>

  render: ->
    <div className="talk-home">
      <Moderation>
        <form onSubmit={@onSubmitBoard}>
          <h2>Moderator Zone:</h2>
          <h3>Add a board:</h3>
          <input type="text" ref="boardTitle" placeholder="Board Title"/>
          <textarea type="text" ref="boardDescription" placeholder="Board Description"></textarea><br />
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
          <p><strong>{@state.discussionsMeta?.count}</strong> Discussions</p>
          <PromiseRenderer promise={talkClient.type('tags').get(section: @props.section)}>{(tags) =>
            <section>
              <h3>Latest Tags:</h3>
              {tags.map(@tag)}
            </section>
          }</PromiseRenderer>
        </div>
      </div>
    </div>
