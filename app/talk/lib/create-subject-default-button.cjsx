React = require 'react'
talkClient = require 'panoptes-client/lib/talk-client'
projectSection = require './project-section'
PromiseRenderer = require '../../components/promise-renderer'
SingleSubmitButton = require '../../components/single-submit-button'

DEFAULT_BOARD_TITLE = 'Notes'            # Name of board to put subject comments
DEFAULT_BOARD_DESCRIPTION = 'General comment threads about individual subjects'


module?.exports = React.createClass
  displayName: 'CreateSubjectDefaultButton'

  propTypes:
    section: React.PropTypes.string
    onCreateBoard: React.PropTypes.func # passed (board) on create

  defaultBoardPromise: ->
    talkClient
      .type('boards')
      .get({section: @props.section, subject_default: true})
      .index(0)

  createSubjectDefaultBoard: ->
    board =
      title: DEFAULT_BOARD_TITLE,
      description: DEFAULT_BOARD_DESCRIPTION
      subject_default: true,
      permissions: {read: 'all', write: 'all'}
      section: @props.section

    talkClient.type('boards').create(board).save()
      .then => @props.onCreateBoard?(board)

  render: ->
    <PromiseRenderer promise={@defaultBoardPromise()}>{(defaultBoard) =>
      if defaultBoard?
        <div>
          <i className="fa fa-check" /> Subject Default Board Setup
        </div>
      else
        <SingleSubmitButton type="button" onClick={@createSubjectDefaultBoard}>
          <i className="fa fa-photo" /> Activate Talk Subject Comments Board
        </SingleSubmitButton>
    }</PromiseRenderer>
