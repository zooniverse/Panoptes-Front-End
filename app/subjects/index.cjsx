React = require 'react'
apiClient = require '../api/client'
authClient = require '../api/auth'
talkClient = require '../api/talk'
getSubjectLocation = require '../lib/get-subject-location'
FavoritesButton = require '../collections/favorites-button'
ChangeListener = require '../components/change-listener'
PromiseRenderer = require '../components/promise-renderer'
SubjectViewer = require '../components/subject-viewer'
NewDiscussionForm = require '../talk/discussion-new-form'
{Navigation} = require 'react-router'

module?.exports = React.createClass
  displayName: 'Subject'
  mixins: [Navigation]

  getInitialState: ->
    subject: null

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
    <div key={data.id} className="talk-module">
      <strong>{data.user_display_name}</strong>
      <br />
      <span>{data.body}</span>
    </div>

  onCreateDiscussion: (discussion) ->
    projectId = discussion.section.split('-')[0] # string
    apiClient.type('projects').get(projectId).then (project) =>
      project.get('owner').then (owner) =>
        @transitionTo('project-talk-discussion', {owner: owner.slug, name: project.slug, board: discussion.board_id, discussion: discussion.id})

  render: ->
    {subject} = @state

    <div className="subject talk">
      {if subject
        <section>
          <h1>Subject {subject.id}</h1>

          <SubjectViewer subject={subject} />

          <PromiseRenderer promise={talkClient.type('comments').get({focus_id: subject.id})}>{(comments) =>
            if comments.length
              <div>
                <h2>Comments mentioning this subject:</h2>
                <p style={color:"red"}>Todo link to thread/comment</p>
                <div>{comments.map(@comment)}</div>
              </div>
            else
              <p>There are no comments focused on this subject</p>
          }</PromiseRenderer>

          <ChangeListener target={authClient}>{=>
            <PromiseRenderer promise={authClient.checkCurrent()}>{(user) =>
              if user?
                {# these wrapping promises ensure that there are boards for a project}
                {# & could be removed if a default board is put in place}
                <PromiseRenderer promise={subject.get('project')}>{(project) =>
                  <PromiseRenderer promise={talkClient.type('boards').get(section: "#{project.id}-#{project.title}")}>{(boards) =>
                    if boards?.length
                      <NewDiscussionForm
                        focusImage={subject}
                        onCreateDiscussion={@onCreateDiscussion} />
                  }</PromiseRenderer>
                }</PromiseRenderer>
            }</PromiseRenderer>
          }</ChangeListener>
        </section>
        }
    </div>
