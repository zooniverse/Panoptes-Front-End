React = require 'react'
AutoSave = require '../components/auto-save'
PromiseRenderer = require '../components/promise-renderer'
handleInputChange = require '../lib/handle-input-change'

module.exports = React.createClass
  displayName: "DisplayNameSlugEditor"

  getDefaultProps: ->
    disabled: false
    resource: {}

  getInitialState: ->
    currentSlug: @props.resource?.slug
    currentName: @props.resource?.display_name

  warnURLChange: ->
    @props.resource.slug isnt @state.currentSlug and @state.currentSlug.match(/untitled-project/i) is null

  resourceURL: ->
    @props.resource.get('owner')
      .then (owner) =>
        "/#{@props.resourceType}s/#{@props.resource.slug}"

  undoNameChange: ->
    @props.resource.update display_name: @state.currentName
    @props.resource.save()

  render: ->
    <p>
      <AutoSave resource={@props.resource}>
        <span className="form-label">Name</span>
        <br />
        <input type="text" className="standard-input full" name="display_name" value={@props.resource.display_name} onChange={handleInputChange.bind @props.resource} disabled={@props.disabled or @props.resource.live}/>
      </AutoSave>

      {if @warnURLChange()
        <small className="form-help">You’re changing the url of your {@props.resourceType}. Users with bookmarks and links in talk will no longer work. <button type="button" onClick={@undoNameChange}>Undo</button></small>
      }

      <PromiseRenderer promise={@resourceURL()} pending={null}>{(url) =>
        <small className="form-help">
          {if @props.resource.live
            "You cannot change a live #{@props.resourceType}'s name."
          else
            "The #{@props.resourceType} name is the first thing people will see about the #{@props.resourceType}, and it will show up in the #{@props.resourceType} URL. Try to keep it short and sweet."}
           Your {@props.resourceType}’s URL is <a href={window.location.origin + url}>{url}</a>
        </small>
      }</PromiseRenderer>
    </p>
