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
    guide: DEV_GUIDE
    actions: actions

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

  render: ->
    <div>
      <div>
        <header>
          <strong>Spotter’s guide</strong>
        </header>
        <ArticleList
          articles={@props.guide.items}
          onReorder={@props.actions.replaceItems.bind null, @props.guide.id}
          onAddArticle={@props.actions.appendItem.bind null, @props.guide.id}
          onRemoveArticle={@props.actions.removeItem.bind null, @props.guide.id}
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
            onSubmit={@props.actions.updateItem.bind null, @props.guide.id, @state.editing}
          />
        </Dialog>}
    </div>

module.exports = SpottersGuideEditor
