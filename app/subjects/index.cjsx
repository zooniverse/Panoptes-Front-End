React = require 'react'
apiClient = require 'panoptes-client/lib/api-client'
SubjectViewer = require '../components/subject-viewer'
ActiveUsers = require '../talk/active-users'
ProjectLinker = require '../talk/lib/project-linker'
SubjectCommentForm = require './comment-form'
SubjectCommentList = require './comment-list'
SubjectDiscussionList = require './discussion-list'
SubjectMentionList = require './mention-list'
SubjectCollectionList = require './collection-list'

`import PopularTags from '../talk/popular-tags';`

module.exports = React.createClass
  displayName: 'Subject'

  getInitialState: ->
    collections: null
    isFavorite: false
    subject: null

  componentWillMount: ->
    @setSubject()

  componentWillReceiveProps: (nextProps) ->
    @setSubject() if nextProps.params?.id isnt @props.params?.id

  setSubject: ->
    subjectId = @props.params.id.toString()
    apiClient.type('subjects').get(subjectId)
    .then (subject) =>
      @setState {subject}
      @getCollections(subject)

  getCollections: (subject) ->
    query =
      subject_id: subject.id
      page_size: 20
      sort: '-created_at'
      include: 'owner'

    apiClient.type('collections').get(query)
      .then (collections) =>
        isFavorite = false
        if collections and @props.user?
          favoriteCollection = collections.filter((collection) => collection.favorite and collection.links.owner.id is @props.user.id and @props.project.id in collection.links.projects)
          isFavorite = subject.id in favoriteCollection[0].links.subjects if favoriteCollection.length > 0
        @setState {collections, isFavorite}

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
                linkToFullImage={true}
                metadataFilters={['#']}
                isFavorite={@state.isFavorite}
              />

              <SubjectCommentList subject={@state.subject} {...@props} />
              <SubjectCollectionList collections={@state.collections} {...@props} />
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
            <ActiveUsers section={@props.section} project={@props.project} />
          </section>

          <section>
            <h3>Projects:</h3>
            <ProjectLinker user={@props.user} />
          </section>
        </div>
      </div>
    </div>
