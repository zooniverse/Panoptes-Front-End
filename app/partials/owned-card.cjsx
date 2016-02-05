React = require 'react'
PromiseRenderer = require '../components/promise-renderer'
{Link} = require 'react-router'
apiClient = require 'panoptes-client/lib/api-client'
counterpart = require 'counterpart'
Translate = require 'react-translate-component'

FlexibleLink = React.createClass
  displayName: 'FlexibleLink'

  propTypes:
    to: React.PropTypes.string.isRequired
    skipOwner: React.PropTypes.bool

  isExternal: ->
    @props.to.indexOf('http') > -1

  render: ->
    if @isExternal()
      <a href={@props.to}>{@props.children}</a>
    else
      <Link {...@props}>{@props.children}</Link>

module.exports = React.createClass
  displayName: 'OwnedCard'

  propTypes:
    resource: React.PropTypes.object.isRequired
    imagePromise: React.PropTypes.object.isRequired
    linkTo: React.PropTypes.string.isRequired
    translationObjectName: React.PropTypes.string.isRequired

  resourceOwner: ->
    apiClient.type(@props.resource.links.owner.type).get(@props.resource.links.owner.id)

  componentDidMount: ->
    card = @refs.ownedCard

    @props.imagePromise
      .then (src) =>
        card.style.backgroundImage = "url('#{src}')"
        card.style.backgroundSize = "contain"
      .catch =>
        card.style.background = "url('./assets/simple-pattern.jpg') center center repeat"

    card.classList.add 'project-card' if @props.resource.description?

  render: ->
    [owner, name] = @props.resource.slug.split('/')
    linkProps =
      to: @props.linkTo
      params:
        owner: owner
        name: name

    <FlexibleLink {...linkProps}>
      <div className="card" ref="ownedCard">
        <svg className="card-space-maker" viewBox="0 0 2 1" width="100%"></svg>
        <div className="details">
          <div className="name"><span>{@props.resource.display_name}</span></div>
          {if !@props.skipOwner
            <PromiseRenderer promise={@props.resource.get('owner')}>{ (owner) ->
              if document.location.hash is "/collections"
                <div className="owner">{owner?.display_name ? 'LOADING'}</div>
            }</PromiseRenderer>}
          {<div className="description">{@props.resource.description}</div> if @props.resource.description?}
          {<div className="private"><i className="fa fa-lock"></i> Private</div> if @props.resource.private}
          <button type="button" tabIndex="-1" className="standard-button card-button"><Translate content={"#{@props.translationObjectName}.button"} /></button>
        </div>
      </div>
    </FlexibleLink>
