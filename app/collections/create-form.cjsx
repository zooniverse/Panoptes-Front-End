React = require 'react'
apiClient = require 'panoptes-client/lib/api-client'
counterpart = require 'counterpart'
Translate = require 'react-translate-component'

counterpart.registerTranslations 'en',
  collectionCreateForm:
    private: 'Private'
    submit: "Add Collection"

module?.exports = React.createClass
  displayName: 'CollectionsCreateForm'

  getInitialState: ->
    error: null
    collectionNameLength: 0

  onSubmit: (e) ->
    e.preventDefault()

    displayName = @refs.name.value
    notPublic = @refs.private.checked

    links = {}
    links.project = +@props.project if @props.project?
    links.subjects = [+@props.subject] if @props.subject?

    collection = {
      display_name: displayName
      private: notPublic
      links: links
    }

    apiClient.type('collections').create(collection).save()
      .catch (e) =>
        @setState error: e
      .then (collection) =>
        @refs.name.value = ''
        @refs.private.value = true
        @props.onSubmit collection

  handleNameInputChange: ->
    @setState collectionNameLength: @refs.name.value.length

  render: ->
    <div>
      <form onSubmit={@onSubmit} className="collections-create-form">
        {if @state.error?
          apiError = @state.error.toString()
          errorMessage = switch
            when apiError.indexOf('Must be unique') then 'You can\'t name two collections the same thing!'
            else 'There was a problem creating your collection.'

          <div className="form-help error">{errorMessage}</div>}
        <input className="collection-name-input" ref="name" onChange={@handleNameInputChange} placeholder="Collection Name" />
        <div className="collection-create-form-actions">
          <label>
            <input ref="private" type="checkbox" defaultChecked={false}/>
            <Translate content="collectionCreateForm.private" />
          </label>
          <div className="submit-button-container">
            {if @state.collectionNameLength is 0
              <button type="submit" disabled><Translate content="collectionCreateForm.submit" /></button>
            else
              <button type="submit"><Translate content="collectionCreateForm.submit" /></button>}
          </div>
        </div>
      </form>
    </div>
