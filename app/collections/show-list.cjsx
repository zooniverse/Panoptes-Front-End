React = require 'react'
Router = require 'react-router'
pick = require 'lodash.pick'
Translate = require 'react-translate-component'
counterpart = require 'counterpart'
talkClient = require '../api/talk'
apiClient = require '../api/client'
Paginator = require '../talk/lib/paginator'
SubjectViewer = require '../components/subject-viewer'
Loading = require '../components/loading-indicator'

VALID_COLLECTION_MEMBER_SUBJECTS_PARAMS = ['page', 'page_size']

counterpart.registerTranslations 'en',
  collectionSubjectListPage:
    error: 'There was an error listing this collection.'
    noSubjects: 'No subjects in this collection.'

module?.exports = React.createClass
  displayName: 'CollectionShowList'
  mixins: [Router.Navigation, Router.State]

  getInitialState: ->
    errorThrown: false
    isLoading: true
    pageCount: 0
    subjects: []

  componentDidMount: ->
    @fetchCollectionSubjects pick @props.query, VALID_COLLECTION_MEMBER_SUBJECTS_PARAMS

  componentWillReceiveProps: (nextProps) ->
    @fetchCollectionSubjects pick nextProps.query, VALID_COLLECTION_MEMBER_SUBJECTS_PARAMS

  fetchCollectionSubjects: (query) ->
    @setState
      errorThrown: false
      isLoading: true

    defaultQuery =
      page: 1
      page_size: 12

    query = Object.assign defaultQuery, query
    @props.collection.get 'subjects', query
      .then (subjects) =>
        newState =
          subjects: subjects
          pageCount: subjects[0]?.getMeta().page_count || 0
        @setState newState
      .catch =>
        @setState errorThrown: true
      .then =>
        @setState isLoading: false

  onPageChange: (page) ->
    nextQuery = Object.assign @props.query, { page }
    @transitionTo @getPath(), @props.params, nextQuery

  render: ->
    subjectNode = (subject) ->
      <SubjectViewer defaultStyle={false} key={subject.id} subject={subject} />

    <div className="collections-show">
      {if @state.isLoading
        <Loading />}

      {if @state.errorThrown
        <Translate component="p" className="form-help error" content="collectionSubjectListPage.error" />}

      {if @state.subjects.length is 0 && !@state.isLoading && !@state.errorThrown
        <Translate component="p" content="collectionSubjectListPage.noSubjects" />}

      {if @state.subjects.length > 0 && !@state.isLoading
        <div>
          <div className="collection-subjects-list">{@state.subjects.map(subjectNode)}</div>

          <Paginator
            page={+@props.query.page}
            onPageChange={@onPageChange}
            pageCount={@state.pageCount} />
        </div>}
    </div>
