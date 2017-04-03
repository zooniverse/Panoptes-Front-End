React = require 'react'
{Link} = require 'react-router'
apiClient = require 'panoptes-client/lib/api-client'
intersection = require 'lodash.intersection'
pick = require 'lodash.pick'
Translate = require 'react-translate-component'
counterpart = require 'counterpart'
Paginator = require '../talk/lib/paginator'
SubjectViewer = require '../components/subject-viewer'
Loading = require '../components/loading-indicator'
CollectionsManager = require './manager'
Dialog = require 'modal-form/dialog'

VALID_COLLECTION_MEMBER_SUBJECTS_PARAMS = ['page', 'page_size']

counterpart.registerTranslations 'en',
  collectionSubjectListPage:
    error: 'There was an error listing this collection.'
    noSubjects: 'No subjects in this collection.'

SubjectNode = React.createClass

  contextTypes:
    geordi: React.PropTypes.object.isRequired

  getInitialState: ->
    isFavorite: false
    project: null

  componentWillMount: ->
    @fetchProject(@props.subject)
      .then (project) =>
        @setState {project}
        @isFavorite(project)

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

  isFavorite: (project) ->
    if @props.collection.favorite and @props.collection.links.owner.id is @props.user.id
      @setState isFavorite: true
    else if @props.user?
      query = {
        favorite: true
        project_ids: project.id
        owner: @props.user.login
      }
      isFavorite = false

      apiClient.type('collections').get(query)
        .then ([favoritesCollection]) =>
          if favoritesCollection?
            isFavorite = @props.subject.id in favoritesCollection.links.subjects
          @setState({ isFavorite })

  handleSelect: (action) ->
    @props.handleSelect @props.subject.id, action

  render: ->
    logClick = @context.geordi?.makeHandler? 'about-menu'
    <div className="collection-subject-viewer">
      <SubjectViewer defaultStyle={false} subject={@props.subject} user={@props.user} project={@state.project} isFavorite={@state.isFavorite}>
          {if !@props.selecting
            <Link className="subject-link" to={"/projects/#{@state.project?.slug}/talk/subjects/#{@props.subject.id}"} onClick={logClick?.bind(this, 'view-favorite')}>
              <span></span>
            </Link>}
          {if @isOwnerOrCollaborator() and !@props.selecting
            <button type="button" className="collection-subject-viewer-delete-button" onClick={@props.onDelete}>
              <i className="fa fa-close" />
            </button>}
          {if @props.selecting and !@props.selected
            <div className="collection-subject-viewer-selecting">
              <button className="collection-subject-viewer-select" onClick={@handleSelect.bind @, 'add'}>
                <i className="fa fa-circle-o" />
              </button>
            </div>}
          {if @props.selecting and @props.selected
            <div className="collection-subject-viewer-selecting">
              <button className="collection-subject-viewer-select" onClick={@handleSelect.bind @, 'delete'}>
              <i className="fa fa-check" />
              </button>
            </div>}
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
    selecting: false
    selected: []
    collectionsManaging: false

  getDefaultProps: ->
    project: null

  propTypes:
    project: React.PropTypes.object

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

  openCollectionsManager: ->
    @setState {collectionsManaging: true}

  closeCollectionsManager: ->
    @setState {collectionsManaging: false}

  toggleSelect: ->
    @setState selecting: !@state.selecting, selected: []

  selected: (subjectID) ->
    if @state.selected?.indexOf(subjectID) isnt -1
      true
    else
      false

  handleSelect: (subjectID, action) ->
    selected = @state.selected
    if action is 'add'
      selected.push subjectID
      @setState {selected}
    if action is 'delete'
      index = selected.indexOf subjectID
      selected.splice index, 1
      @setState {selected}

  handleDeleteSubject: (subject) ->
    subjects = @state.subjects
    index = subjects.indexOf subject
    subjects.splice index, 1
    @setState {subjects}

    @props.collection.removeLink 'subjects', [subject.id.toString()]
      .then =>
        @props.collection.uncacheLink 'subjects'

  deleteSubjects: () ->
    subjects = @state.subjects.filter((subject) => @state.selected.indexOf(subject.id) is -1)
    @setState {subjects}

    @props.collection.removeLink 'subjects', @state.selected
      .then =>
        @props.collection.uncacheLink 'subjects'

    @toggleSelect()

  render: ->
    if @state.subjects?
      <div className="collections-show">
        {if @state.subjects.length is 0
          <Translate component="p" content="collectionSubjectListPage.noSubjects" />}

        {if @state.subjects.length > 0
          meta = @state.subjects[0].getMeta()

          <div>
          {if @state.selecting
            <div className="collection-buttons-container">
              <button
                className="select-images-button"
                onClick={@openCollectionsManager}
                disabled={@state.selected.length < 1}>
                <span>Add to Collection</span>
              </button>
              {if @state.collectionsManaging
                <Dialog tag="div" closeButton={true} onCancel={@closeCollectionsManager}>
                <CollectionsManager user={@props.user} project={@props.project} subjectIDs={@state.selected} onSuccess={@closeCollectionsManager} />
                </Dialog>}
              <button className="select-images-button" onClick={@deleteSubjects} disabled={@state.selected.length < 1}>Remove from Collection</button>
              <button className="select-images-button" onClick={@toggleSelect}>Cancel</button>
            </div>
          else
            <div className="collection-buttons-container">
              <button className="select-images-button" onClick={@toggleSelect}>Select Images</button>
            </div>
          }
            <div className="collection-subjects-list">
              {@state.subjects.map (subject) =>
                <SubjectNode
                  key={subject.id}
                  collection={@props.collection}
                  subject={subject}
                  user={@props.user}
                  roles={@props.roles}
                  selecting={@state.selecting}
                  selected={@selected(subject.id)}
                  handleSelect={@handleSelect}
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
