React = require 'react'
{History, Link} = require 'react-router'
talkClient = require 'panoptes-client/lib/talk-client'
NewDiscussionForm = require '../talk/discussion-new-form'
QuickSubjectCommentForm= require '../talk/quick-subject-comment-form'
PromiseRenderer = require '../components/promise-renderer'
Loading = require '../components/loading-indicator'
SignInPrompt = require '../partials/sign-in-prompt'
alert = require '../lib/alert'

module?.exports = React.createClass
  displayName: 'SubjectCommentForm'
  mixins: [History]

  componentWillMount: ->
    Promise.all([@getBoards(), @getSubjectDefaultBoard()]).then =>
      @setState loading: false

  getInitialState: ->
    loading: true
    tab: 0

  getBoards: ->
    talkClient.type('boards').get(section: @props.section, subject_default: false).then (boards) =>
      @setState {boards}

  getSubjectDefaultBoard: ->
    talkClient.type('boards').get(section: @props.section, subject_default: true).then ([subjectDefaultBoard]) =>
      @setState {subjectDefaultBoard}

  onCreateDiscussion: (createdDiscussion) ->
    {owner, name} = @props.params
    board = createdDiscussion.board_id
    discussion = createdDiscussion.id
    @history.pushState(null, "/projects/#{owner}/#{name}/talk/#{board}/#{discussion}")

  linkToClassifier: (text) ->
    [owner, name] = @props.project.slug.split('/')
    <Link to={"/projects/#{owner}/#{name}/classify"}>{text}</Link>

  popup: ->
    alert (resolve) -> <SignInPrompt onChoose={resolve} />

  loginPrompt: ->
    <p>
      Please{' '}
      <button className="link-style" type="button" onClick={@popup}>
        sign in
      </button>{' '}
      to contribute to subject discussions
    </p>

  notSetup: ->
    <p>There are no discussion boards setup for this project yet. Check back soon!</p>

  quickComment: ->
    if @state.subjectDefaultBoard
      <QuickSubjectCommentForm {...@props} subject={@props.subject} user={@props.user} />
    else
      <p>
        There is no default board for subject comments setup yet, Please{' '}
        <button className="link-style" onClick={=> @setState(tab: 1)}>start a new discussion</button>{' '}
        or {@linkToClassifier('return to classifying')}
      </p>

  startDiscussion: ->
    <NewDiscussionForm
      user={@props.user}
      subject={@props.subject}
      onCreateDiscussion={@onCreateDiscussion} />

  renderTab: ->
    switch @state.tab
      when 0 then @quickComment()
      when 1 then @startDiscussion()

  render: ->
    return <Loading /> if @state.loading
    return @notSetup() unless @state.boards
    return @loginPrompt() unless @props.user

    <div>
      <div className="tabbed-content">
        <div className="tabbed-content-tabs">
          <div className="subject-page-tabs">
            <div className="tabbed-content-tab #{if @state.tab is 0 then 'active' else ''}" onClick={=> @setState({tab: 0})}>
              Add a note about this subject
            </div>

            <div className="tabbed-content-tab #{if @state.tab is 1 then 'active' else ''}" onClick={=> @setState({tab: 1})}>
              Start a new discussion
            </div>
          </div>
        </div>
      </div>

      {@renderTab()}
    </div>
