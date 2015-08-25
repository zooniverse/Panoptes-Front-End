React = require 'react'
talkClient = require '../../api/talk'
CreateSubjectDefaultButton = require '../../talk/lib/create-subject-default-button'
CreateBoardForm = require '../../talk/lib/create-board-form'
projectSection = require '../../talk/lib/project-section'

module?.exports = React.createClass
  displayName: 'EditProjectTalk'

  getDefaultProps: ->
    project: {}

  getInitialState: ->
    boards: []

  section: ->
    projectSection(@props.project)

  componentWillMount: ->
    @setBoards()

  setBoards: ->
    talkClient.type('boards').get({section: @section()})
      .then (boards) => @setState {boards}

  board: (board, i) ->
    <li key={board.id}>
      {board.title}{if board.subject_default then ' (Subject Default)' else ''}
    </li>

  render: ->
    <div className="edit-project-talk talk">
      <p className="form-help">Setup your project's talk</p>

      <p>
        “Talk” is the name for the discussion boards attached to your project. On your Talk, volunteers will be able to discuss your project and subjects with each other, as well as with you and your project’s researchers. Maintaining a vibrant and active Talk is important for keeping your volunteers engaged with your project. Conversations on Talk also can lead to additional research discoveries.
      </p>

      <p>
        You can use this page to set up the initial Talk boards for your project. We highly recommend first activating the default subject-discussion board, which hosts a single dedicated conversation for each subject. After that, you can add additional boards, where each board will host conversation about a general topic. Example boards might include: “Announcements,” “Project Discussion,” “Questions for the Research Team,” or “Technical Support.”
      </p>

      <p>1. Click this button to create a default board for volunteers to comment on subjects after classifying (strongly recommended)</p>

      <CreateSubjectDefaultButton section={@section()} onCreateBoard={=> @setBoards()} />

      <p>2. Add any additional discussion boards</p>

      <div className="talk-module">
        <CreateBoardForm section={@section()} onSubmitBoard={=> @setBoards()}/>
      </div>

      <p>Your Project's Discussion Boards</p>
      <div>
        {if @state.boards.length
          <ul>{@state.boards.map(@board)}</ul>
        else
          <p>See above to add boards to your project, or look in the moderator controls listed under the talk tab of your project!</p>}
      </div>
    </div>
