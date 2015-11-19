React = require 'react'
ArticleListItem = require './article-list-item'
DragReorderable = require 'drag-reorderable'

ArticleList = React.createClass
  getDefaultProps: ->
    articles: []
    onReorder: ->
    onSelectArticle: ->
    onAddArticle: ->
    onRemoveArticle: ->

  renderArticle: (article, i) ->
    article._key ?= Math.random()
    <li key={article._key}>
      <ArticleListItem
        title={article.title}
        onClick={@props.onSelectArticle.bind null, i}
      />
      <button type="button" title="Remove" onClick={@props.onRemoveArticle.bind null, i}>-</button>
    </li>

  render: ->
    <div>
      <DragReorderable tag="ul" items={@props.articles} render={@renderArticle} onChange={@props.onReorder} />
      <button type="button" title="Add" onClick={@props.onAddArticle}>+</button>
    </div>

module.exports = ArticleList
