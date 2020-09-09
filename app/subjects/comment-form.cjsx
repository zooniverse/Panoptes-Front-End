React = require 'react'
PropTypes = require 'prop-types'
createReactClass = require 'create-react-class'
{Link} = require 'react-router'
talkClient = require 'panoptes-client/lib/talk-client'
NewDiscussionForm = require '../talk/discussion-new-form'
QuickSubjectCommentForm= require '../talk/quick-subject-comment-form'
Loading = require('../components/loading-indicator').default
SignInPrompt = require '../partials/sign-in-prompt'
alert = require('../lib/alert').default

module.exports = createReactClass
  displayName: 'SubjectCommentForm'

  contextTypes:
    router: PropTypes.object.isRequired

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
    @context.router.push "/projects/#{owner}/#{name}/talk/#{board}/#{discussion}"

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

  noDefaultBoardMessage: ->
    <p>There are no discussion boards setup for this project yet. Please check back soon or {@linkToClassifier('return to classifying')}.</p>

  quickComment: ->
    if @state.subjectDefaultBoard
      <QuickSubjectCommentForm {...@props} subject={@props.subject} user={@props.user} />
    else
      @noDefaultBoardMessage()

  startDiscussion: ->
    <NewDiscussionForm
      user={@props.user}
      project={@props.project}
      subject={@props.subject}
      onCreateDiscussion={@onCreateDiscussion} />

  renderTab: ->
    switch @state.tab
      when 0 then @quickComment()
      when 1 then @startDiscussion()

  render: ->
    invalidEmail = <p>You must have a <Link to="/settings/email">valid email address</Link> in order to contribute to the conversation.</p>
    return <Loading /> if @state.loading
    return @noDefaultBoardMessage() unless @state.boards
    return @loginPrompt() unless @props.user
    return invalidEmail unless @props.user?.valid_email

    if @state.boards.length < 1
      @renderTab()
    else
      <div className="tabbed-content">
        <div className="tabbed-content-tabs">
          <div className="subject-page-tabs">
            <div className="tabbed-content-tab #{if @state.tab is 0 then 'active' else ''}" onClick={=> @setState({tab: 0})}>
              <button className="link-style">
                Add a note about this subject
              </button>
            </div>

            <div className="tabbed-content-tab #{if @state.tab is 1 then 'active' else ''}" onClick={=> @setState({tab: 1})}>
              <button className="link-style">
                Start a new discussion
              </button>
            </div>
          </div>
        </div>
        {@renderTab()}
      </div>
