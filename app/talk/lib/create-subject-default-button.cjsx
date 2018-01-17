React = require 'react'
PropTypes = require 'prop-types'
createReactClass = require 'create-react-class'
talkClient = require 'panoptes-client/lib/talk-client'
SingleSubmitButton = require '../../components/single-submit-button'

DEFAULT_BOARD_TITLE = 'Notes'            # Name of board to put subject comments
DEFAULT_BOARD_DESCRIPTION = 'General comment threads about individual subjects'


module.exports = createReactClass
  displayName: 'CreateSubjectDefaultButton'

  propTypes:
    section: PropTypes.string
    onCreateBoard: PropTypes.func # passed (board) on create

  getInitialState: ->
    defaultBoard: null

  componentWillMount: ->
    @getDefaultBoard @props.section

  componentWillReceiveProps: (newProps) ->
    @getDefaultBoard newProps.section if newProps.section isnt @props.section

  getDefaultBoard: (section) ->
    talkClient
      .type 'boards'
      .get
        section: section
        subject_default: true
      .index 0
      .then (defaultBoard) =>
        @setState {defaultBoard}

  createSubjectDefaultBoard: ->
    board =
      title: DEFAULT_BOARD_TITLE,
      description: DEFAULT_BOARD_DESCRIPTION
      subject_default: true,
      permissions: {read: 'all', write: 'all'}
      section: @props.section

    talkClient.type('boards').create(board).save().then (defaultBoard) =>
      @props.onCreateBoard?(board)
      @setState {defaultBoard}

  render: ->
    if @state.defaultBoard?
      <div>
        <i className="fa fa-check" /> Subject Default Board Setup
      </div>
    else
      <SingleSubmitButton type="button" onClick={@createSubjectDefaultBoard}>
        <i className="fa fa-photo" /> Activate Talk Subject Comments Board
      </SingleSubmitButton>
