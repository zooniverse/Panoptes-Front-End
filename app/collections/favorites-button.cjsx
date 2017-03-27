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
    isFavorite: React.PropTypes.bool

  getDefaultProps: ->
    subject: null
    project: null
    user: null
    isFavorite: false

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

  findSubjectInCollection: () ->
    if @props.subject.hasOwnProperty 'favorite'
      Promise.resolve @props.subject.favorite
    else
      Promise.resolve false

  componentWillMount: ->
    favorited = @props.isFavorite
    @setState {favorited}


  componentDidUpdate: (prevProps) ->
    if prevProps.subject isnt @props.subject
      favorited = @props.isFavorite
      @setState {favorited}

  addSubjectTo: (collection) ->
    @setState favorited: true
    collection.addLink('subjects', [@props.subject.id.toString()])

  removeSubjectFrom: (collection) ->
    @setState favorited: false
    collection.removeLink('subjects', [@props.subject.id.toString()])

  createFavorites: ->
    new Promise (resolve, reject) =>
      @findFavoriteCollection()
        .catch (err) ->
          reject err
        .then (favorites) =>
          if favorites?
            @setState {favorites}
            resolve favorites
          else
            display_name = getFavoritesName(@props.project)
            project = @props.project?.id
            subjects = []
            favorite = true

            links = {subjects}
            links.projects = [ project ] if project?
            collection = {favorite, display_name, links}
            apiClient.type('collections')
              .create(collection)
              .save()
              .catch (err) ->
                reject err
              .then (favorites) =>
                @setState {favorites}
                resolve favorites

  toggleFavorite: ->
    if @props.user?
      if not @state.favorites?
        @setState favorited: true
        @createFavorites()
        .then (favorites) =>
          @addSubjectTo(favorites)
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
