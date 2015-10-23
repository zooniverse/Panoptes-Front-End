React = require 'react'
apiClient = require '../api/client'
talkClient = require '../api/talk'
SubjectViewer = require '../components/subject-viewer'
Comment = require '../talk/comment'
Paginator = require '../talk/lib/paginator'
PopularTags = require '../talk/popular-tags'
ActiveUsers = require '../talk/active-users'
ProjectLinker = require '../talk/lib/project-linker'
SubjectCommentForm = require './comment-form'

module?.exports = React.createClass
  displayName: 'Subject'

  getInitialState: ->
    subject: null
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

            <SubjectCommentForm subject={subject} {...@props} />
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
