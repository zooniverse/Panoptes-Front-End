apiClient = require '../../../api/client'
React = require 'react'
ArticleList = require './article-list'
Dialog = require 'modal-form/dialog'
ArticleEditor = require './article-editor'
actions = require './actions'

unless process.env.NODE_ENV is 'production'
  DEV_GUIDE = apiClient.type('field_guides').create
    id: 'DEV_GUIDE'
    items: [{
      title: 'Hey',
      content: 'Spot this.'
    }]

SpottersGuideEditor = React.createClass
  getDefaultProps: ->
    project: null
    actions: actions

  getInitialState: ->
    guide: null
    icons: {}
    editing: null

  componentDidMount: ->
    @loadGuide @props.project

  componentWillReceiveProps: (nextProps) ->
    unless nextProps.project is @props.project
      @loadGuide nextProps.project

  loadGuide: (project) ->
    apiClient.type('field_guides').get project_id: project.id
      .then ([guide]) =>
        @listenTo guide
        @fetchIcons guide
        @setState {guide}

  listenTo: (guide) ->
    @_forceUpdate ?= @forceUpdate.bind this
    @_currentGuide?.stopListening @_forceUpdate
    guide?.listen @_forceUpdate
    @_currentGuide = guide

  fetchIcons: (guide) ->
    guide.uncacheLink 'attached_images'
    guide.get 'attached_images'
      .then (images) =>
        icons = {}
        images.forEach (image) ->
          icons[image.id] = image
        @setState {icons}

  createArticle: ->
    @props.actions.appendItem @state.guide.id
      .then =>
        @editArticle @state.guide.items.length - 1

  editArticle: (index) ->
    @setState editing: index

  handleArticleSave: (newData) ->
    {icon, title, content} = newData

    awaitIconAction = if icon?
      if icon is ArticleEditor.SHOULD_REMOVE_ICON
        @props.actions.removeItemIcon @state.guide.id, @state.editing
      else
        @props.actions.setItemIcon @state.guide.id, @state.editing, icon
    else
      Promise.resolve()

    awaitIconAction.then =>
      @props.actions.updateItem @state.guide.id, @state.editing, {title, content}
        .then =>
          if icon?
            @fetchIcons @state.guide
          @editArticle null

  render: ->
    <div>
      <header>
        <strong>Spotter’s guide</strong>
      </header>
      {if @state.guide?
        @renderEditor()
      else
        @renderCreator()}
    </div>

  renderCreator: ->
    <div>
      <p>
        This project doesn’t have a field guide yet.{' '}
        <button type="button" onClick={@props.actions.createGuide.bind null, @props.project.id}>Create one!</button>
      </p>
    </div>

  renderEditor: ->
    window.editingGuide = @state.guide
    <div>
      <div>
        <ArticleList
          articles={@state.guide.items}
          icons={@state.icons}
          onReorder={@props.actions.replaceItems.bind null, @state.guide.id}
          onAddArticle={@createArticle}
          onRemoveArticle={@props.actions.removeItem.bind null, @state.guide.id}
          onSelectArticle={@editArticle}
        />
      </div>

      <div>
        <p>Help text will go here.</p>
      </div>

      {if @state.editing?
        article = @state.guide.items[@state.editing]
        <Dialog required>
          <ArticleEditor
            icon={@state.icons[article.icon]?.src}
            title={article.title}
            content={article.content}
            working={@state.guide._busy}
            onCancel={@editArticle.bind this, null}
            onSave={@handleArticleSave}
          />
        </Dialog>}
    </div>

module.exports = SpottersGuideEditor
