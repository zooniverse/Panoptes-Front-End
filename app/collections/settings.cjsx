React = require 'react'
{Navigation} = require 'react-router'
DisplayNameSlugEditor = require '../partials/display-name-slug-editor'
auth = require '../api/auth'
apiClient = require '../api/client'
alert = require '../lib/alert'
SetToggle = require '../lib/set-toggle'
PromiseRenderer = require '../components/promise-renderer'

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

  checkUserRole: ->
    auth.checkCurrent().then (user) =>
      if user
        apiClient.type('collection_roles').get(collection_id: @props.collection.id, user_id: user?.id)
          .catch ->
            []
          .then ([roles]) ->
            roles?

  deleteCollection: (callback = ->) ->
    @props.collection.delete()
      .then =>
        callback?()
        @transitionTo 'collections'

  confirmDelete: ->
    alert (resolve) =>
      <div className="confirm-delete-dialog content-container">
        <p>Are you sure you want to delete this collection? This action is irreversible!</p>
        <button className="major-button" onClick={@deleteCollection.bind(this, resolve)}>Yes, delete it!</button>
        {' '}
        <button className="minor-button" onClick={resolve}>No, don't delete it.</button>
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
