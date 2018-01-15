React = require 'react'
createReactClass = require 'create-react-class'
talkClient = require 'panoptes-client/lib/talk-client'
CreateSubjectDefaultButton = require '../../talk/lib/create-subject-default-button'
CreateBoardForm = require '../../talk/lib/create-board-form'
projectSection = require '../../talk/lib/project-section'
SingleSubmitButton = require '../../components/single-submit-button'

module.exports = createReactClass
  displayName: 'EditProjectTalk'

  getDefaultProps: ->
    project: {}

  getInitialState: ->
    boards: []
    editingBoard: null
    suggestedTags: []

  section: ->
    projectSection(@props.project)

  componentDidMount: ->
    @getSuggestedTags()
    @setBoards()

  setBoards: ->
    talkClient.type('boards').get({section: @section()})
      .then (boards) => @setState {boards}

  onClickEditTitle: (e, board) ->
    e.preventDefault()
    titleInput = @refs["board-title-#{board.id}"]
    title = titleInput.value

    descriptionTextarea = @refs["board-description-#{board.id}"]
    description = descriptionTextarea.value

    talkClient.type('boards').get(board.id).update({title, description}).save().then =>
      @setState({editingBoard: null}, @setBoards)

  onClickDeleteBoard: (e, board) ->
    e.preventDefault()
    if window.confirm("Are you sure that you want to delete the #{board.title} board? All of it's content will be lost forever")
      talkClient.type('boards').get(board.id).delete().then @setBoards

  board: (board, i) ->
    <li key={board.id}>

      {if @state.editingBoard is board.id
        <div className="talk-module talk-form">
          <span>Title</span>
          <input ref={"board-title-#{board.id}"} type="text" defaultValue={board.title}/>
          <div>Description</div>
          <textarea ref={"board-description-#{board.id}"} defaultValue={board.description}/>
          <button type="button" onClick={=> @setState({editingBoard: null})}>Cancel</button>
          <button type="button" onClick={(e) => @onClickEditTitle(e, board)}>Submit</button>
        </div>
      else
        <span>
          <span>{board.title}{if board.subject_default then ' (Subject Default)' else ''}{' '}</span>
          <i className="fa fa-pencil" title="Edit Title" onClick={=> @setState {editingBoard: if @state.editingBoard then null else board.id}}/>{' '}
          <i className="fa fa-close" title="Delete" onClick={(e) => @onClickDeleteBoard(e, board)} />
        </span>

        }

      <ul><li style={listStyleType: 'none', opacity: 0.5}>{board.description}</li></ul>
    </li>

  getSuggestedTags: ->
    talkClient.type('suggested_tags').get(section: @section()).then (suggestedTags) =>
      @setState {suggestedTags}

  deleteSuggestedTag: (tag) ->
    tag.delete().then =>
      @getSuggestedTags()

  suggestedTag: (tag) ->
    <div className="suggested-tag" key={"suggested-tag-#{tag.id}"}>
      #{tag.name}
      <SingleSubmitButton type="submit" onClick={@deleteSuggestedTag.bind @, tag}>Remove</SingleSubmitButton>
    </div>

  suggestedTagChanged: (e) ->
    key = e.which or e.keyCode
    if key is 13 # enter
      @createSuggestedTag e
    else if @state.suggestedTagError
      @setState suggestedTagError: null

  createSuggestedTag: (e) ->
    e.preventDefault()
    name = @refs.newSuggestedTag.value.trim().toLowerCase()
    @setState suggestedTagError: null
    talkClient.type('suggested_tags').create(section: @section(), name: name).save().then =>
      @refs.newSuggestedTag.value = ''
      @getSuggestedTags()
    .catch (e) =>
      @setState suggestedTagError: e.message

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
        <CreateBoardForm section={@section()} user={@props.user} onSubmitBoard={=> @setBoards()}/>
      </div>

      <p>Your Project's Discussion Boards</p>
      <div>
        {if @state.boards.length
          <ul>{@state.boards.map(@board)}</ul>
        else
          <p>See above to add boards to your project, or look in the moderator controls listed under the talk tab of your project!</p>}
      </div>

      <p>3. You can create a list of suggested tags to use. Suggested tags are weighted higher in autocompletion results as well as populating the list of tags when you first type "#" in a Talk text box.</p>
      <div className="suggested-tags">
        {@state.suggestedTags.map(@suggestedTag)}
        <input type="text" ref="newSuggestedTag" placeholder="New suggested tag" onKeyUp={@suggestedTagChanged} />
        <SingleSubmitButton type="submit" onClick={@createSuggestedTag}>Create</SingleSubmitButton>
        {if @state.suggestedTagError
          <span className="error">{@state.suggestedTagError}</span>}
      </div>
    </div>
