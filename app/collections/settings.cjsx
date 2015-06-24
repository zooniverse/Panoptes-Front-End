React = require 'react'
DisplayNameSlugEditor = require '../partials/display-name-slug-editor'
auth = require '../api/auth'
apiClient = require '../api/client'
SetToggle = require '../lib/set-toggle'
PromiseRenderer = require '../components/promise-renderer'

module.exports = React.createClass
  displayName: "CollectionSettings"

  getDefaultProps: ->
    collection: null

  mixins: [SetToggle]

  setterProperty: 'collection'

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

  render: ->
    <PromiseRenderer promise={@checkUserRole()}>{(allowed) =>
      <div className="collection-settings-tab">
        <DisplayNameSlugEditor resource={@props.collection} resourceType="collection" disabled={not allowed} />

        <hr />

        <span className="form-label">Visibility</span>
        <p>
          <label style={whiteSpace: 'nowrap'}>
            <input type="radio" name="private" value={true} data-json-value={true} checked={@props.collection.private} disabled={not allowed or @state.setting.private} onChange={@set.bind this, 'private', true} />
            Private
          </label>
          &emsp;
          <label style={whiteSpace: 'nowrap'}>
            <input type="radio" name="private" value={false} data-json-value={true} checked={not @props.collection.private} disabled={not allowed or @state.setting.private} onChange={@set.bind this, 'private', false} />
            Public
          </label>
        </p>

        <p className="form-help">Only the assigned <strong>collaborators</strong> can view a private project. Anyone with the URL can access a public project.</p>
      </div>
    }</PromiseRenderer>
