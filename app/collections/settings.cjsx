React = require 'react'
{Navigation} = require 'react-router'
DisplayNameSlugEditor = require '../partials/display-name-slug-editor'
auth = require '../api/auth'
apiClient = require '../api/client'
alert = require '../lib/alert'
SetToggle = require '../lib/set-toggle'
PromiseRenderer = require '../components/promise-renderer'

CollectionDeleteDialog = React.createClass
  displayName: 'CollectionDeleteDialog'

  getDefaultProps: ->
    collection: null
    onComplete: Function.prototype

  getInitialState: ->
    isDeleting: false

  deleteCollection:  ->
    @setState isDeleting: true

    @props.collection.delete()
      .then =>
        @props.onComplete()

  render: ->
    <div>
      <p>Are you sure you want to delete this collection? This action is irreversible!</p>

      {if @state.isDeleting
        <div>
          <button className="major-button" disabled><i className="fa fa-spinner" /></button>
          {' '}
        </div>}

      {if !@state.isDeleting
        <div>
          <button className="major-button" onClick={@deleteCollection}>Yes, delete it!</button>
          {' '}
          <button className="minor-button" onClick={@props.onComplete}>No, don't delete it.</button>
        </div>}
    </div>

module.exports = React.createClass
  displayName: "CollectionSettings"
  mixins: [Navigation, SetToggle]
  setterProperty: 'collection'

  getDefaultProps: ->
    collection: null

  getInitialState: ->
    error: null
    setting:
      private: false

  componentDidMount: ->
    @props.collection.listen 'delete', @redirect

  componentDidUnMount: ->
    @props.collection.stopListening 'delete'

  redirect: ->
    @transitionTo 'collections'

  checkUserRole: ->
    auth.checkCurrent().then (user) =>
      if user
        apiClient.type('collection_roles').get(collection_id: @props.collection.id, user_id: user?.id)
          .catch ->
            []
          .then ([roles]) ->
            roles?

  confirmDelete: ->
    alert (resolve) =>
      <div className="confirm-delete-dialog content-container">
        <CollectionDeleteDialog {...@props} onComplete={resolve} />
      </div>

  render: ->
    <PromiseRenderer promise={@checkUserRole()}>{(allowed) =>
      <div className="collection-settings-tab">
        <DisplayNameSlugEditor resource={@props.collection} resourceType="collection" disabled={not allowed} />

        <hr />

        <span className="form-label">Visibility</span>
        <p>
          <label style={whiteSpace: 'nowrap'}>
            <input type="radio" name="private" value={true} data-json-value={true} checked={@props.collection.private} onChange={@set.bind this, 'private', true} />
            Private
          </label>
          &emsp;
          <label style={whiteSpace: 'nowrap'}>
            <input type="radio" name="private" value={false} data-json-value={true} checked={not @props.collection.private} onChange={@set.bind this, 'private', false} />
            Public
          </label>
        </p>

        <p className="form-help">Only the assigned <strong>collaborators</strong> can view a private project. Anyone with the URL can access a public project.</p>

        <hr />

        <div className="form-label">Delete this Collection</div>
        <div className="delete-container">
          <button className="error major-button" type="button" onClick={@confirmDelete}>Delete</button>
        </div>
      </div>
    }</PromiseRenderer>
