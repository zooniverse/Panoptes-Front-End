React = require 'react'
{alert} = require 'modal-form/dialog'



ArticleEditor = React.createClass
  getDefaultProps: ->
    title: ''
    content: ''

  render: ->
    <div>
      <label>
        Title<br />
        <input type="text" defaultValue={@props.title} />
      </label>
      <br />

      <label>
        Content<br />
        <textarea defaultValue={@props.content} />
      </label>

      <label>
        <button type="submit">Done</button>
      </label>
    </div>

  handleTitleChange: (e) ->
    @props.onChangeTitle e.target.value, arguments...

  handleContentChange: (e) ->
    @props.onChangeContent e.target.value, arguments...



ArticleListItem = React.createClass
  getDefaultProps: ->
    title: ''
    onClick: ->

  render: ->
    <div>
      <button type="button" onClick={@props.onClick}>{@props.title}</button>
    </div>



ArticlesList = React.createClass
  getDefaultProps: ->
    articles: []
    onSelectArticle: ->
    onAddArticle: ->

  render: ->
    <div>
      {@props.articles.map (article, i) =>
        article._key ?= Math.random()
        <ArticleListItem
          key={article._key}
          title={article.title}
          onClick={@props.onSelectArticle.bind null, i}
        />}
      <button type="button" onClick={@props.onAddArticle}>Add</button>
    </div>



SpottersGuideEditor = React.createClass
  getDefaultProps: ->
    guide: {
      items: [{
        title: 'Hey',
        content: 'Spot this.'
      }]
    }

  render: ->
    <div>
      <div>
        <header>Spotter’s guide</header>
        <ArticlesList
          articles={@props.guide.items}
          onAddArticle={@handleArticleAddition}
          onRemoveArticle={@handleArticleRemoval}
          onSelectArticle={@startEditingArticle}
        />
      </div>
      <div>
        <p>Help text will go here.</p>
      </div>
    </div>

  startEditingArticle: (index) ->
    article = @props.guide.items[index]

    alert <ArticleEditor
      title={article.title}
      content={article.content}
    />

  handleArticleTitleChange: (index, title) ->
    @props.guide.update {title}

  handleArticleContentChange: (index, content) ->
    @props.guide.update {content}

  handleArticleAddition: ->

  handleArticleRemoval: (index) ->

module.exports = SpottersGuideEditor
