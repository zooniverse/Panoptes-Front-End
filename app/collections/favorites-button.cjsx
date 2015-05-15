React = require 'react'
apiClient = require '../api/client'
auth = require '../api/auth'
getFavoritesName = require './get-favorites-name'
alert = require '../lib/alert'
SignInPrompt = require '../partials/sign-in-prompt'

module?.exports = React.createClass
  displayName: 'CollectionFavoritesButton'

  propTypes:
    subject: React.PropTypes.object # a subject response from panoptes

  getInitialState: ->
    favorited: false

  promptToSignIn: ->
    alert <SignInPrompt>
      <p>You must be signed in to save your favorites.</p>
    </SignInPrompt>

  componentWillMount: ->
    # see if the subject is in the project's favorites collection
    # to see if it's favoriters
    @props.subject.get('project')
      .then (project) =>
        project_id = project.id.toString()
        apiClient.type('projects').get(project_id)
          .then (project) =>
            display_name = getFavoritesName(project)

            apiClient.type('collections').get({project_id, display_name}).index(0)
              .then (favorites) =>
                if !!favorites
                  apiClient.type('subjects').get(collection_id: favorites.id, id: @props.subject.id).index(0)
                    .then (subject) =>
                      @setState favorited: !!subject

  addSubjectTo: (collection) ->
    collection.addLink('subjects', [@props.subject.id.toString()])
      .then (collection) => @setState favorited: true

  removeSubjectFrom: (collection) ->
    collection.removeLink('subjects', [@props.subject.id.toString()])
      .then (collection) => @setState favorited: false

  createFavorites: (user, project) ->
    project_id = project.id.toString()
    apiClient.type('projects').get(project_id)
      .then (project) =>
        display_name = getFavoritesName(project)
        project = @props.subject.links.project

        owner = {id: user.id.toString(), type: "users"} #--> must supply type
        links = {project, owner}
        collection = {display_name, links}

        apiClient.type('collections').create(collection).save()
          .then (favorites) =>
            @addSubjectTo(favorites)

  toggleFavorite: ->
    project_id = @props.subject.links.project.toString()

    @props.subject.get('project')
      .then (project) =>
        project_id = project.id.toString()
        auth.checkCurrent().then (user) =>
          if user?
            apiClient.type('projects').get(project_id)
              .then (project) =>
                display_name = getFavoritesName(project)
                # check for a favorites collection in project first
                apiClient.type('collections').get({project_id, display_name}).index(0)
                  .then (favorites) =>
                    # try to request subject from favorites collection, otherwise create it
                    if !!favorites
                      apiClient.type('subjects').get(collection_id: favorites.id, id: @props.subject.id).index(0)
                        .then (subject) =>
                          if subject
                            @removeSubjectFrom(favorites)
                          else
                            @addSubjectTo(favorites)
                    else
                      @createFavorites(user, project)
          else
            @promptToSignIn()

  render: ->
    <button
      className="favorites-button"
      type="button"
      onClick={@toggleFavorite}>
      <i className="fa fa-heart#{if @state.favorited then '' else '-o'}" />
    </button>
