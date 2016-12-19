React = require 'react'
intersection = require 'lodash.intersection'
pick = require 'lodash.pick'
Translate = require 'react-translate-component'
counterpart = require 'counterpart'
Paginator = require '../talk/lib/paginator'
SubjectViewer = require '../components/subject-viewer'
Loading = require '../components/loading-indicator'
{Link} = require 'react-router'

VALID_COLLECTION_MEMBER_SUBJECTS_PARAMS = ['page', 'page_size']

counterpart.registerTranslations 'en',
  collectionSubjectListPage:
    error: 'There was an error listing this collection.'
    noSubjects: 'No subjects in this collection.'

SubjectNode = React.createClass

  contextTypes:
    geordi: React.PropTypes.object.isRequired

  getInitialState: ->
    project: null
  
  componentWillMount: ->
    @fetchProject(@props.subject)
      .then (project) =>
        @setState {project}

  fetchProject: (subject) ->
    projectRequest = if @props.collection?.links.project?
      @props.collection.get('project')
    else
      subject.get('project')

  isOwnerOrCollaborator: ->
    collaboratorOrOwnerRoles = @props.roles.filter (collectionRoles) ->
      intersection(['owner', 'collaborator'], collectionRoles.roles).length

    hasPermission = false
    collaboratorOrOwnerRoles.forEach (roleSet) =>
      if roleSet.links.owner.id is @props.user?.id
        hasPermission = true

    return hasPermission

  render: ->
    logClick = @context.geordi?.makeHandler? 'about-menu'
    <div className="collection-subject-viewer">
      <SubjectViewer defaultStyle={false} subject={@props.subject} user={@props.user} project={@state.project}>
        {if @isOwnerOrCollaborator()
          <button type="button" className="collection-subject-viewer-delete-button" onClick={@props.onDelete}>
            <i className="fa fa-close" />
          </button>}
          <Link className="subject-link" to={"/projects/#{@state.project?.slug}/talk/subjects/#{@props.subject.id}"} onClick={logClick?.bind(this, 'view-favorite')}>
            <span></span>
          </Link>
      </SubjectViewer>
    </div>
    
module.exports = React.createClass
  displayName: 'CollectionShowList'

  contextTypes:
    geordi: React.PropTypes.object.isRequired
    router: React.PropTypes.object.isRequired

  getInitialState: ->
    subjects: null
    error: null

  componentWillMount: ->
    @fetchCollectionSubjects pick @props.location.query, VALID_COLLECTION_MEMBER_SUBJECTS_PARAMS
      .then (subjects) =>
        error = null
        @setState {subjects, error}

  componentWillReceiveProps: (nextProps, nextContext) ->
    @fetchCollectionSubjects pick nextProps.location.query, VALID_COLLECTION_MEMBER_SUBJECTS_PARAMS
      .then (subjects) =>
        error = null
        @setState {subjects, error}

  fetchCollectionSubjects: (query = null) ->
    query ?= @props.location.query

    defaultQuery =
      page: 1
      page_size: 12

    query = Object.assign {}, defaultQuery, query
    return @props.collection.get 'subjects', query
      .catch (error) =>
        @setState {error}

  onPageChange: (page) ->
    nextQuery = Object.assign {}, @props.location.query, { page }
    @context.router.push
      pathname: @props.location.pathname
      query: nextQuery

  handleDeleteSubject: (subject) ->
    subjects = @state.subjects
    index = subjects.indexOf subject
    subjects.splice index, 1
    @setState {subjects}
    
    @props.collection.removeLink 'subjects', [subject.id.toString()]
      .then =>
        @props.collection.uncacheLink 'subjects'

  render: ->
    if @state.subjects?
      <div className="collections-show">
        {if @state.subjects.length is 0
          <Translate component="p" content="collectionSubjectListPage.noSubjects" />}

        {if @state.subjects.length > 0
          meta = @state.subjects[0].getMeta()

          <div>
            <div className="collection-subjects-list">
              {@state.subjects.map (subject) =>
                <SubjectNode
                  key={subject.id}
                  subject={subject}
                  user={@props.user}
                  roles={@props.roles}
                  onDelete={@handleDeleteSubject.bind @, subject}
                />
              }
            </div>

            <Paginator
              page={meta.page}
              onPageChange={@onPageChange}
              pageCount={meta.page_count} />
          </div>}
      </div>
    else if @state.error
      <Translate component="p" className="form-help error" content="collectionSubjectListPage.error" />
    else
      <Loading />
