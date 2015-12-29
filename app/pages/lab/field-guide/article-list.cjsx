React = require 'react'
ArticleListItem = require './article-list-item'
DragReorderable = require 'drag-reorderable'

ArticleList = React.createClass
  getDefaultProps: ->
    articles: []
    icons: {}
    onReorder: ->
    onSelectArticle: ->
    onAddArticle: ->
    onRemoveArticle: ->

  renderArticle: (article, i) ->
    article._key ?= Math.random()
    <li key={article._key} className="field-guide-editor-article-list-item-container">
      <ArticleListItem
        icon={@props.icons[article.icon]?.src}
        title={article.title}
        onClick={@props.onSelectArticle.bind null, i}
      />
      <button type="button" className="field-guide-editor-article-list-item-remove-button" title="Remove" onClick={@props.onRemoveArticle.bind null, i}>
        <i className="fa fa-trash-o fa-fw"></i>
      </button>
    </li>

  render: ->
    <div>
      <DragReorderable tag="ul" className="field-guide-editor-article-list" items={@props.articles} render={@renderArticle} onChange={@props.onReorder} />
      <button type="button" title="Add" onClick={@props.onAddArticle}>+</button>
    </div>

module.exports = ArticleList
