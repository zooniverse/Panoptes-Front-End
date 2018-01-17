React = require 'react'
createReactClass = require 'create-react-class'
ArticleListItem = require './article-list-item'
DragReorderable = require 'drag-reorderable'

ArticleList = createReactClass
  getDefaultProps: ->
    articles: []
    icons: {}
    onReorder: ->
    onSelectArticle: ->
    onRemoveArticle: ->

  renderArticle: (article, i) ->
    article._key ?= Math.random()
    <li key={article._key} className="field-guide-editor-article-list-item-container">
      <ArticleListItem
        icon={@props.icons[article.icon]?.src}
        title={article.title}
        onClick={@props.onSelectArticle.bind null, i}
      />
      <button type="button" className="field-guide-editor-article-list-item-remove-button" title="Remove this entry" onClick={@props.onRemoveArticle.bind null, i}>
        <i className="fa fa-trash-o fa-fw"></i>
      </button>
    </li>

  render: ->
    <DragReorderable tag="ul" className="field-guide-editor-article-list" items={@props.articles} render={@renderArticle} onChange={@props.onReorder} />

module.exports = ArticleList
