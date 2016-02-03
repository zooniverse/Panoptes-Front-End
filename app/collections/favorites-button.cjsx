React = require 'react'
apiClient = require 'panoptes-client/lib/api-client'
getFavoritesName = require './get-favorites-name'
alert = require '../lib/alert'
SignInPrompt = require '../partials/sign-in-prompt'
PromiseRenderer = require '../components/promise-renderer'

module?.exports = React.createClass
  displayName: 'CollectionFavoritesButton'

  propTypes:
    subject: React.PropTypes.object # a subject response from panoptes
    project: React.PropTypes.object # a project response from panoptes
    user: React.PropTypes.object

  getDefaultProps: ->
    subject: null
    project: null
    user: null

  getInitialState: ->
    favoritesPromise: null
    favoritedPromise: null
    favorites: {}
    favorited: false

  promptToSignIn: ->
    alert (resolve) ->
      <SignInPrompt onChoose={resolve}>
        <p>You must be signed in to save your favorites.</p>
      </SignInPrompt>

  findFavoriteCollection: ->
    apiClient.type('collections')
      .get({project_ids: @props.project?.id, favorite: true, owner: @props.user.login})
      .then ([favorites]) -> if favorites? then favorites else null

  findSubjectInCollection: (favorites) ->
    if favorites?
      favorites.get('subjects', id: @props.subject.id)
        .then ([subject]) -> subject?
    else
      Promise.resolve(false)

  componentWillMount: ->
    # see if the subject is in the project's favorites collection
    # to see if it's favorites
    favoritesPromise = @findFavoriteCollection()
    favoritedPromise = favoritesPromise.then (favs) => @findSubjectInCollection(favs)

    @setState {favoritesPromise, favoritedPromise}

  addSubjectTo: (collection) ->
    collection.addLink('subjects', [@props.subject.id.toString()])
      .then (collection) => @setState favoritedPromise: Promise.resolve(true)

  removeSubjectFrom: (collection) ->
    collection.removeLink('subjects', [@props.subject.id.toString()])
      .then (collection) => @setState favoritedPromise: Promise.resolve(false)

  createFavorites: ->
    display_name = getFavoritesName(@props.project)
    project = @props.project?.id
    subjects = [@props.subject.id]
    favorite = true

    links = {subjects}
    links.projects = [ project ] if project?
    collection = {favorite, display_name, links}

    apiClient.type('collections').create(collection).save().then =>
      @setState favoritedPromise: Promise.resolve(true)

  toggleFavorite: ->
    if @props.user?
      Promise.all([@state.favoritesPromise, @state.favoritedPromise])
        .then ([favorites, favorited]) =>
          if not favorites?
            @createFavorites()
          else if favorited
            @removeSubjectFrom(favorites)
          else
            @addSubjectTo(favorites)
    else
      @promptToSignIn()

  render: ->
    <PromiseRenderer promise={@state.favoritedPromise}>{(favorited) =>
      <button
        className="favorites-button"
        type="button"
        title={if favorited then 'Unfavorite' else 'Favorite'}
        onClick={@toggleFavorite}>
        <i className="
          fa fa-heart#{if favorited then '' else '-o'}
          #{if favorited then 'favorited' else ''}
        " />
      </button>
    }</PromiseRenderer>
