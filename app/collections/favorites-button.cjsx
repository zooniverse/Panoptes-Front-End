React = require 'react'
apiClient = require 'panoptes-client/lib/api-client'
getFavoritesName = require './get-favorites-name'
alert = require '../lib/alert'
SignInPrompt = require '../partials/sign-in-prompt'

module.exports = React.createClass
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
    favorites: null
    favorited: false

  contextTypes:
    geordi: React.PropTypes.object 

  logSubjLike: (liked) ->
    @context.geordi?.logEvent
      type: liked

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
      false

  componentWillMount: ->
    # see if the subject is in the project's favorites collection
    # to see if it's favorites
    @findFavoriteCollection()
      .then (favorites) =>
        @setState {favorites}
        @findSubjectInCollection(favorites)
      .then (favorited) =>
        @setState {favorited}

  addSubjectTo: (collection) ->
    @setState favorited: true
    collection.addLink('subjects', [@props.subject.id.toString()])

  removeSubjectFrom: (collection) ->
    @setState favorited: false
    collection.removeLink('subjects', [@props.subject.id.toString()])

  createFavorites: ->
    display_name = getFavoritesName(@props.project)
    project = @props.project?.id
    subjects = [@props.subject.id]
    favorite = true

    links = {subjects}
    links.projects = [ project ] if project?
    collection = {favorite, display_name, links}

    @setState favorited: true
    apiClient.type('collections').create(collection).save()

  toggleFavorite: ->
    if @props.user?
      if not @state.favorites?
        @createFavorites()
        @logSubjLike 'favorite'
      else if @state.favorited
        @removeSubjectFrom(@state.favorites)
        @logSubjLike 'unfavorite'
      else
        @addSubjectTo(@state.favorites)
        @logSubjLike 'favorite'
    else
      @promptToSignIn()
      @logSubjLike 'favorite'

  render: ->
    <button
      className="favorites-button #{@props.className ? ''}"
      type="button"
      title={if @state.favorited then 'Unfavorite' else 'Favorite'}
      onClick={@toggleFavorite}>
      <i className="
        fa fa-heart#{if @state.favorited then '' else '-o'}
        #{if @state.favorited then 'favorited' else ''}
        fa-fw
      " />
    </button>
