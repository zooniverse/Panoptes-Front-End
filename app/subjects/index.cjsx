React = require 'react'
apiClient = require 'panoptes-client/lib/api-client'
talkClient = require 'panoptes-client/lib/talk-client'
SubjectViewer = require '../components/subject-viewer'
PopularTags = require '../talk/popular-tags'
ActiveUsers = require '../talk/active-users'
ProjectLinker = require '../talk/lib/project-linker'
SubjectCommentForm = require './comment-form'
SubjectCommentList = require './comment-list'
SubjectDiscussionList = require './discussion-list'
SubjectMentionList = require './mention-list'
SubjectCollectionList = require './collection-list'

module?.exports = React.createClass
  displayName: 'Subject'

  getInitialState: ->
    subject: null

  componentWillMount: ->
    @setSubject()

  componentWillReceiveProps: (nextProps) ->
    @setSubject() if nextProps.params?.id isnt @props.params?.id

  setSubject: ->
    subjectId = @props.params.id.toString()
    apiClient.type('subjects').get(subjectId).then (subject) =>
      @setState {subject}

  render: ->
    <div className="subject-page talk">
      <div className="talk-list-content">
        <section>
          {if @state.subject
            <div>
              <h1>Subject {@state.subject.id}</h1>

              <SubjectViewer
                subject={@state.subject}
                user={@props.user}
                project={@props.project}
                linkToFullImage={true}/>

              <SubjectCommentList subject={@state.subject} {...@props} />
              <SubjectCollectionList subject={@state.subject} {...@props} />
              <SubjectDiscussionList subject={@state.subject} {...@props} />
              <SubjectMentionList subject={@state.subject} {...@props} />
              <SubjectCommentForm subject={@state.subject} {...@props} />
            </div>}
        </section>
        <div className="talk-sidebar">
          <section>
            <PopularTags
              header={<h3>Popular Tags:</h3>}
              section={@props.section}
              type="Subject"
              id={@props.params.id}
              project={@props.project} />
          </section>

          <section>
            <ActiveUsers section={@props.section} />
          </section>

          <section>
            <h3>Projects:</h3>
            <ProjectLinker user={@props.user} />
          </section>
        </div>
      </div>
    </div>
