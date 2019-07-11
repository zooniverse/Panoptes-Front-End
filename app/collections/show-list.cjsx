React = require 'react'
PropTypes = require 'prop-types'
createReactClass = require 'create-react-class'
{Link} = require 'react-router'
Translate = require 'react-translate-component'
apiClient = require 'panoptes-client/lib/api-client'
intersection = require 'lodash/intersection'
pick = require 'lodash/pick'
classNames = require 'classnames'
counterpart = require 'counterpart'
alert = require('../lib/alert').default
Paginator = require '../talk/lib/paginator'
SubjectViewer = require '../components/subject-viewer'
Loading = require('../components/loading-indicator').default
`import CollectionsManager from './collections-manager';`
getSubjectLocation = require('../lib/get-subject-location')

VALID_COLLECTION_MEMBER_SUBJECTS_PARAMS = ['page', 'page_size']

counterpart.registerTranslations 'en',
  collectionSubjectListPage:
    error: 'There was an error listing this collection.'
    noSubjects: 'No subjects in this collection.'

SubjectNode = createReactClass

  contextTypes:
    geordi: PropTypes.object.isRequired

  getInitialState: ->
    isFavorite: false
    project: null

  componentWillMount: ->
    # if the project context is set use that
    if @props.projectContext
      @updateProjectState(@props.projectContext)
    else
    # otherwise use the original project context
      @props.subject.get('project')
        .then (project) =>
          @updateProjectState(project)

  updateProjectState: (project) ->
    @setState {project}
    @isFavorite(project)

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
          if favoritesCollection? and favoritesCollection.links.subjects?
            isFavorite = @props.subject.id in favoritesCollection.links.subjects
          @setState({ isFavorite })

  toggleSelect: (e) ->
    if e.target.checked
      @props.addSelected()
    else
      @props.removeSelected()

  setCollectionCover: () ->
    @props.collection.addLink('default_subject', @props.subject.id)

  render: ->
    logClick = @context.geordi?.makeHandler? 'about-menu'
    subjectSelectClasses = classNames({
      "collection-subject-viewer-circle": true,
      "fa fa-check-circle": !!@props.selected,
      "fa fa-circle-o": !@props.selected
    })

    { src } = getSubjectLocation(@props.subject);

    <div className="collection-subject-viewer">
      <SubjectViewer defaultStyle={false} subject={@props.subject} user={@props.user} project={@props.projectContext} isFavorite={@state.isFavorite}>
        {if !@props.selecting
          <Link className="subject-link" to={"/projects/#{@state.project?.slug}/talk/subjects/#{@props.subject.id}"} onClick={logClick?.bind(this, 'view-favorite')}>
            <span></span>
          </Link>}
        {if @props.canCollaborate and !@props.selecting
          <button
            type="button"
            aria-label="Delete"
            className="collection-subject-viewer-delete-button"
            onClick={@props.onDelete}>
            <i className="fa fa-close" />
          </button>}
        {if @props.selecting
          <label className="collection-subject-viewer-select">
            <input
              aria-label={if @props.selected then "Selected" else "Not Selected"}
              type="checkbox"
              checked={@props.selected}
              onChange={@toggleSelect}/>
            <i className={subjectSelectClasses} />
          </label>}
      </SubjectViewer>
      {if @props.canCollaborate and @props.collection.default_subject_src
        if src is @props.collection.default_subject_src
          <div className="collection-subject-viewer__default-label">Collection Cover</div>
        else
          <button
            type="button"
            className="collection-subject-viewer__default-label collection-subject-viewer__button--cover"
            onClick={@setCollectionCover}
          >
            Set as collection cover
          </button>}
    </div>

module.exports = createReactClass
  displayName: 'CollectionShowList'

  contextTypes:
    geordi: PropTypes.object.isRequired
    router: PropTypes.object.isRequired

  getInitialState: ->
    subjects: null
    error: null
    selecting: false
    selected: []

  getDefaultProps: ->
    project: null

  propTypes:
    project: PropTypes.object

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

  toggleSelecting: ->
    @setState selecting: !@state.selecting, selected: []

  addSelected: (subjectID) ->
    selected = @state.selected
    selected.push subjectID
    @setState {selected}

  removeSelected: (subjectID) ->
    selected = @state.selected
    index = selected.indexOf subjectID
    selected.splice index, 1
    @setState {selected}

  selected: (subjectID) ->
    @state.selected?.indexOf(subjectID) isnt -1

  promptCollectionManager: ->
    alert (resolve) =>
      <CollectionsManager user={@props.user} project={@props.project} subjectIDs={@state.selected} onSuccess={() => @toggleSelecting(); resolve();} />

  handleDeleteSubject: (subject) ->
    subjects = @state.subjects
    index = subjects.indexOf subject
    subjects.splice index, 1
    @setState {subjects}

    @props.collection.removeLink 'subjects', [subject.id.toString()]
      .then =>
        @props.collection.uncacheLink 'subjects'

  confirmDeleteSubjects: ->
    alert (resolve) =>
      <div className="confirm-delete-dialog content-container">
        <p>Are you sure you want to remove {@state.selected.length} subjects from this collection?</p>
        <div style={{ textAlign: "center" }}>
          <button className="minor-button" autoFocus={true} onClick={resolve}>Cancel</button>
        {' '}
          <button className="major-button" onClick={() => @deleteSubjects(); resolve();}>Yes</button>
        </div>
      </div>

  deleteSubjects: ->
    subjects = @state.subjects.filter((subject) => @state.selected.indexOf(subject.id) is -1)
    @setState {subjects}

    @props.collection.removeLink 'subjects', @state.selected
      .then =>
        @props.collection.uncacheLink 'subjects'

    @toggleSelecting()

  render: ->
    if @state.subjects?
      <div>
        <div className="collection__description-container">
          {if @props.collection.description
            <p className="collection__description">
              {@props.collection.description}
            </p>}

          {if @state.selecting
            <div className="collection__buttons-container">
              <button
                type="button"
                className="collection__select-subjects-button"
                onClick={@promptCollectionManager}
                disabled={@state.selected.length < 1}>
                Add to Collection
              </button>
              {if @props.canCollaborate
                <button
                  type="button"
                  className="collection__select-subjects-button"
                  onClick={@confirmDeleteSubjects}
                  disabled={@state.selected.length < 1}>
                  Remove from Collection
                </button>}
              <button type="button" className="collection__select-subjects-button" onClick={@toggleSelecting}>Cancel</button>
            </div>
          else if @props.user?
            <div className="collection__buttons-container">
              <button type="button" className="collection__select-subjects-button" onClick={@toggleSelecting}>Select Subjects</button>
            </div>}
          </div>

          <div className="collections-show">
            {if @state.subjects.length is 0
              <Translate component="p" content="collectionSubjectListPage.noSubjects" />}

            {if @state.subjects.length > 0
              meta = @state.subjects[0].getMeta()

              <div>
                {@state.subjects.map (subject) =>
                  <SubjectNode
                    key={subject.id}
                    collection={@props.collection}
                    subject={subject}
                    projectContext={@props.project}
                    user={@props.user}
                    canCollaborate={@props.canCollaborate}
                    selecting={@state.selecting}
                    selected={@selected(subject.id)}
                    addSelected={@addSelected.bind @, subject.id}
                    removeSelected={@removeSelected.bind @, subject.id}
                    onDelete={@handleDeleteSubject.bind @, subject}
                  />}
                <Paginator
                  className="talk"
                  page={meta.page}
                  onPageChange={@onPageChange}
                  pageCount={meta.page_count}
                />
              </div>}
          </div>
      </div>
    else if @state.error
      <Translate component="p" className="form-help error" content="collectionSubjectListPage.error" />
    else
      <Loading />
