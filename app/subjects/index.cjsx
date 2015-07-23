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
{Navigation} = require 'react-router'

indexOf = (elem) ->
  (elem while elem = elem.previousSibling).length

module?.exports = React.createClass
  displayName: 'Subject'
  mixins: [Navigation]

  getInitialState: ->
    subject: null
    tab: 0

  componentWillMount: ->
    @setSubject()

  componentWillReceiveProps: (nextProps) ->
    if nextProps.params?.id isnt @props.params?.id
      @setSubject()

  setSubject: ->
    subjectId = @props.params?.id.toString()
    apiClient.type('subjects').get(subjectId)
      .then (subject) =>
        @setState {subject}

  comment: (data, i) ->
    <CommentLink key={data.id} comment={data}>
      <div className="talk-module">
        <strong>{data.user_display_name}</strong>
        <br />
        <span>{data.body}</span>
      </div>
    </CommentLink>

  onCreateDiscussion: (discussion) ->
    projectId = parseSection(discussion.section)
    apiClient.type('projects').get(projectId).then (project) =>
      project.get('owner').then (owner) =>
        @transitionTo('project-talk-discussion', {owner: owner.login, name: project.slug, board: discussion.board_id, discussion: discussion.id})

  render: ->
    {subject} = @state

    <div className="subject talk">
      {if subject
        <section>
          <h1>Subject {subject.id}</h1>

          <SubjectViewer subject={subject} user={@props.user}/>

          <PromiseRenderer promise={talkClient.type('comments').get({focus_id: subject.id, focus_type: 'Subject'})}>{(comments) =>
            if comments.length
              <div>
                <h2>Comments mentioning this subject:</h2>
                <div>{comments.map(@comment)}</div>
              </div>
            else
              <p>There are no comments focused on this subject</p>
          }</PromiseRenderer>

          {if @props.user
            {# these wrapping promises ensure that there are boards for a project}
            {# & could be removed if a default board is put in place}
            {# TODO remove subject.get('project'), replace with params but browser freezes on get to projects with slug}
            <PromiseRenderer promise={subject.get('project')}>{(project) =>
              <PromiseRenderer promise={talkClient.type('boards').get(section: projectSection(project))}>{(boards) =>
                if boards?.length
                  <div>
                    <div className="tabbed-content">
                      <div className="tabbed-content-tabs">
                        <div className="subject-page-tabs">
                          <div className="tabbed-content-tab #{if @state.tab is 0 then 'active' else ''}" onClick={=> @setState({tab: 0})}>
                            <span>Add a note about this subject</span>
                          </div>

                          <div className="tabbed-content-tab #{if @state.tab is 1 then 'active' else ''}" onClick={=> @setState({tab: 1})}>
                            <span>or Start a new discussion</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      {if @state.tab is 0
                        <QuickSubjectCommentForm subject={subject} user={@props.user} />
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
            }</PromiseRenderer>}
        </section>
        }
    </div>
