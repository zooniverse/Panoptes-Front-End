React = require 'react'
{Navigation} = require '@edpaget/react-router'
DisplayNameSlugEditor = require '../partials/display-name-slug-editor'
apiClient = require '../api/client'
alert = require '../lib/alert'
SetToggle = require '../lib/set-toggle'
ChangeListener = require '../components/change-listener'

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
    if @props.user?
      apiClient.type('collection_roles').get(collection_id: @props.collection.id, user_id: @props.user.id)
        .catch ->
          []
        .then ([roles]) ->
          roles?

  confirmDelete: ->
    alert (resolve) =>
      <div className="confirm-delete-dialog content-container">
        <CollectionDeleteDialog {...@props} onComplete={resolve} />
      </div>

  public_collection: ->
    if @props.collection.private?
      not @props.collection.private
    else
      @props.collection.private

  render: ->
    <div className="collection-settings-tab">
      <ChangeListener target={@props.collection}>{=>
        <DisplayNameSlugEditor resource={@props.collection} resourceType="collection" />
      }</ChangeListener>

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
