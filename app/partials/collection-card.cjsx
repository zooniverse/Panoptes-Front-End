React = require 'react'
{Link} = require 'react-router'
apiClient = require 'panoptes-client/lib/api-client'
Translate = require 'react-translate-component'

FlexibleLink = React.createClass
  displayName: 'FlexibleLink'

  propTypes:
    to: React.PropTypes.string.isRequired
    skipOwner: React.PropTypes.bool

  contextTypes:
    geordi: React.PropTypes.object

  isExternal: ->
    @props.to.indexOf('http') > -1

  render: ->
    @logClick = @context.geordi?.makeHandler? 'profile-menu'
    if @isExternal()
      <a href={@props.to}>{@props.children}</a>
    else
      <Link
        {...@props}
        onClick={@logClick?.bind(this, @props.logText)}>{@props.children}</Link>

module.exports = React.createClass
  displayName: 'CollectionCard'

  propTypes:
    collection: React.PropTypes.object.isRequired
    imagePromise: React.PropTypes.object.isRequired
    linkTo: React.PropTypes.string.isRequired
    translationObjectName: React.PropTypes.string.isRequired

  collectionOwner: ->
    apiClient.type(@props.collection.links.owner.type).get(@props.collection.links.owner.id)

  componentDidMount: ->
    card = @refs.collectionCard

    @props.imagePromise
      .then (src) =>
        card.style.backgroundImage = "url('#{src}')"
        card.style.backgroundSize = "contain"
      .catch =>
        card.style.background = "url('/assets/simple-pattern.jpg') center center repeat"

  render: ->
    [owner, name] = @props.collection.slug.split('/')
    dataText = "view-#{@props.translationObjectName?.toLowerCase().replace(/page$/,'').replace(/s?$/,'')}"

    linkProps =
      to: @props.linkTo
      logText: dataText
      params:
        owner: owner
        name: name


    <FlexibleLink {...linkProps}>
      <div className="collection-card" ref="collectionCard">
        <svg className="card-space-maker" viewBox="0 0 2 1" width="100%"></svg>
        <div className="details">
          <div className="name"><span>{@props.collection.display_name}</span></div>
          {<div className="public-spaceholder">&nbsp;</div> if !@props.collection.private}
          {if !@props.skipOwner
            <div className="owner">{@props.collection.links.owner.display_name}</div>}
          {<div className="description">{@props.collection.description}</div> if @props.collection.description?}
          {<div className="private"><i className="fa fa-lock"></i> Private</div> if @props.collection.private}
          <button type="button" tabIndex="-1" className="standard-button card-button"><Translate content={"#{@props.translationObjectName}.button"} /></button>
        </div>
      </div>
    </FlexibleLink>
