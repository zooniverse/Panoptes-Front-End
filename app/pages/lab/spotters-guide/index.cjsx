apiClient = require '../../../api/client'
React = require 'react'
ArticleList = require './article-list'
Dialog = require 'modal-form/dialog'
ArticleEditor = require './article-editor'

DEFAULT_ARTICLE =
  title: 'Title'
  content: 'Content'

unless process.env.NODE_ENV is 'production'
  DEV_GUIDE = apiClient.type('field_guides').create
    items: [{
      title: 'Hey',
      content: 'Spot this.'
    }]

SpottersGuideEditor = React.createClass
  getDefaultProps: ->
    guide: DEV_GUIDE

  getInitialState: ->
    editing: null

  componentDidMount: ->
      @attachTo @props.guide

  componentWillReceiveProps: (nextProps) ->
    unless nextProps.guide is @props.guide
      @attachTo nextProps.guide

  attachTo: (guide) ->
    @_oldGuide?.stopListening @_forceUpdate
    @_forceUpdate ?= @forceUpdate.bind this
    guide.listen @_forceUpdate
    @_oldGuide = guide

  editArticle: (index) ->
    @setState editing: index

  updateArticle: (index, changes) ->
    @props.guide.update _busy: true
    for key, value of changes
      @props.guide.items[index][key] = value
    @props.guide.update 'items'
    @save().then =>
      @editArticle null

  appendArticle: ->
    @props.guide.update _busy: true
    @props.guide.items.push Object.assign {}, DEFAULT_ARTICLE
    @props.guide.update 'items'
    @save()

  removeArticle: (index) ->
    @props.guide.update _busy: true
    @props.guide.items.splice index, 1
    @props.guide.update 'items'
    @save()

  save: ->
    new Promise (resolve) =>
      @props.guide.update _busy: true
      setTimeout (=>
        @props.guide.update _busy: false
        resolve()
      ), 1000

  render: ->
    <div>
      <div>
        <header>
          <strong>Spotter’s guide</strong>
        </header>
        <ArticleList
          articles={@props.guide.items}
          onAddArticle={@appendArticle}
          onRemoveArticle={@removeArticle}
          onSelectArticle={@editArticle}
        />
      </div>

      <div>
        <p>Help text will go here.</p>
      </div>

      {if @state.editing?
        article = @props.guide.items[@state.editing]
        <Dialog component="div" required>
          <ArticleEditor
            title={article.title}
            content={article.content}
            working={@props.guide._busy}
            onCancel={@editArticle.bind this, null}
            onSubmit={@updateArticle.bind this, @state.editing}
          />
        </Dialog>}
    </div>

module.exports = SpottersGuideEditor
