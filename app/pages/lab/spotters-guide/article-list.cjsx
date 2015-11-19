React = require 'react'
ArticleListItem = require './article-list-item'

ArticleList = React.createClass
  getDefaultProps: ->
    articles: []
    onSelectArticle: ->
    onAddArticle: ->
    onRemoveArticle: ->

  render: ->
    <div>
      <ul>
        {@props.articles.map (article, i) =>
          article._key ?= Math.random()
          <li key={article._key}>
            <ArticleListItem
              title={article.title}
              onClick={@props.onSelectArticle.bind null, i}
            />
            <button type="button" title="Remove" onClick={@props.onRemoveArticle.bind null, i}>-</button>
          </li>}
      </ul>
      <button type="button" title="Add" onClick={@props.onAddArticle}>+</button>
    </div>

module.exports = ArticleList
