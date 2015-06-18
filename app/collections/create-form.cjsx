React = require 'react'
apiClient = require '../api/client'
auth = require '../api/auth'
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

  onSubmit: (e) ->
    e.preventDefault()
    displayName = React.findDOMNode(@refs.name).value
    notPublic = React.findDOMNode(@refs.private).checked
    links = {}
    links.project = +@props.project if @props.project?
    links.subjects = [+@props.subject] if @props.subject?
    collection = {
      display_name: displayName
      private: notPublic
      links: links
    }

    apiClient.type('collections').create(collection).save()
      .then (collection) =>
        @refs.name.value = ''
        @refs.private.value = true
        @props.onSumbit(collection)
      .catch (e) =>
        @setState error: e

  render: ->
    <div>
      <form onSubmit={@onSubmit} className='collections-create-form'>
        {if @state.error?
          <div className="form-help error">{@state.error.toString()}</div>}
        <input ref="name" placeholder="Collection Name" />
        <label>
          <input ref="private" type="checkbox" defaultChecked={true}/>
          <Translate content="collectionCreateForm.private" />
        </label>
        <button type="submit"><Translate content="collectionCreateForm.submit" /></button>
      </form>
    </div>
