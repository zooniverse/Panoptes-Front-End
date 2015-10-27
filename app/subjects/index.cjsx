React = require 'react'
apiClient = require '../api/client'
talkClient = require '../api/talk'
getSubjectLocation = require '../lib/get-subject-location'
FavoritesButton = require '../collections/favorites-button'
PromiseRenderer = require '../components/promise-renderer'
SubjectViewer = require '../components/subject-viewer'
NewDiscussionForm = require '../talk/discussion-new-form'
CommentLink = require '../talk/comment-link'
projectSection = require '../talk/lib/project-section'
parseSection = require '../talk/lib/parse-section'
QuickSubjectCommentForm= require '../talk/quick-subject-comment-form'
{Navigation, Link} = require '@edpaget/react-router'
{Markdown} = require 'markdownz'
alert = require '../lib/alert'
SignInPrompt = require '../partials/sign-in-prompt'
Comment = require '../talk/comment'
Paginator = require '../talk/lib/paginator'
PopularTags = require '../talk/popular-tags'
ActiveUsers = require '../talk/active-users'
ProjectLinker = require '../talk/lib/project-linker'

indexOf = (elem) ->
  (elem while elem = elem.previousSibling).length

promptToSignIn = ->
  alert (resolve) -> <SignInPrompt onChoose={resolve} />

module?.exports = React.createClass
  displayName: 'Subject'
  mixins: [Navigation]

  getInitialState: ->
    subject: null
    tab: 0
    comments: []
    commentsMeta: {}

  getDefaultProps: ->
    query: page: 1

  componentWillMount: ->
    @setSubject().then(@setComments)

  componentWillReceiveProps: (nextProps) ->
    if nextProps.params?.id isnt @props.params?.id
      @setSubject().then(@setComments)

    if nextProps.query.page isnt @props.query.page
      @setComments(@state.subject, nextProps.query.page)

  setSubject: ->
    subjectId = @props.params?.id.toString()
    apiClient.type('subjects').get(subjectId)
      .then (subject) =>
        @setState {subject}
        subject

  setComments: (subject = @state.subject, page = @props.query.page ? 1) ->
    talkClient.type('comments')
      .get({focus_id: subject.id, focus_type: 'Subject', page, sort: '-created_at'})
      .then (comments) =>
        commentsMeta = comments[0]?.getMeta()
        @setState {comments, commentsMeta}

  comment: (comment, i) ->
    <Comment key={comment.id} data={comment} locked={true} linked={true} />

  onCreateDiscussion: (discussion) ->
    projectId = parseSection(discussion.section)
    apiClient.type('projects').get(projectId).then (project) =>
      [owner, name] = project.slug.split('/')
      @transitionTo('project-talk-discussion', {owner: owner, name: name, board: discussion.board_id, discussion: discussion.id})

  linkToClassifier: (text) ->
    [owner, name] = @props.project.slug.split('/')
    <Link to="project-classify" params={{owner, name}}>{text}</Link>

  render: ->
    {subject, comments, commentsMeta} = @state

    <div className="subject-page talk">
      <div className="talk-list-content">
        {if subject
          <section>
            <h1>Subject {subject.id}</h1>

            <SubjectViewer
              subject={subject}
              user={@props.user}
              project={@props.project}
              linkToFullImage={true}/>

            {if comments?.length
              <div>
                <h2>Comments mentioning this subject:</h2>
                <div>{comments.map(@comment)}</div>

                <Paginator
                  page={+commentsMeta?.page}
                  pageCount={+commentsMeta?.page_count}
                />
              </div>
            else
              <p>There are no comments focused on this subject</p>}

            {if @props.user
              {# TODO remove subject.get('project'), replace with params but browser freezes on get to projects with slug}
              project = subject.get('project')
              boards = project.then (project) -> talkClient.type('boards').get(section: projectSection(project), subject_default: false)
              subjectDefaultBoard = project.then (project) -> talkClient.type('boards').get(section: projectSection(project), subject_default: true)

              <PromiseRenderer promise={Promise.all([boards, subjectDefaultBoard])}>{([boards, subjectDefaultBoard]) =>
                defaultExists = subjectDefaultBoard.length
                if boards.length or defaultExists
                  <div>
                    <div className="tabbed-content">
                      <div className="tabbed-content-tabs">
                        <div className="subject-page-tabs">
                          <div className="tabbed-content-tab #{if @state.tab is 0 then 'active' else ''}" onClick={=> @setState({tab: 0})}>
                            <span>Add a note about this subject</span>
                          </div>

                          <div className="tabbed-content-tab #{if @state.tab is 1 then 'active' else ''}" onClick={=> @setState({tab: 1})}>
                            <span>Start a new discussion</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      {if @state.tab is 0
                        if defaultExists
                          <QuickSubjectCommentForm subject={subject} user={@props.user} />
                        else
                          <p>
                            There is no default board for subject comments setup yet, Please{' '}
                            <button className="link-style" onClick={=> @setState(tab: 1)}>start a new discussion</button>{' '}
                            or {@linkToClassifier('return to classifying')}
                          </p>
                       else if @state.tab is 1
                        <NewDiscussionForm
                          user={@props.user}
                          subject={subject}
                          onCreateDiscussion={@onCreateDiscussion} />
                          }
                    </div>
                  </div>
                else
                  <p>There are no discussion boards setup for this project yet. Check back soon!</p>
              }</PromiseRenderer>
            else
              <p>Please <button className="link-style" type="button" onClick={promptToSignIn}>sign in</button> to contribute to subject discussions</p>}
          </section>}
        <div className="talk-sidebar">
          <section>
            <PopularTags
              header={<h3>Popular Tags:</h3>}
              section={@props.section}
              type="Subject"
              id={@props.params.id}
              params={@props.params} />
          </section>

          <section>
            <ActiveUsers section={@props.section} />
          </section>

          <section>
            <h3>Projects:</h3>
            <p><ProjectLinker user={@props.user} /></p>
          </section>
        </div>
      </div>
    </div>
