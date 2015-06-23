React = require 'react'
PromiseRenderer = require '../components/promise-renderer'
{Link} = require 'react-router'
apiClient = require '../api/client'
counterpart = require 'counterpart'
Translate = require 'react-translate-component'

FlexibleLink = React.createClass
  displayName: 'FlexibleLink'

  propTypes:
    to: React.PropTypes.string.isRequired

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
    card = @refs.ownedCard.getDOMNode()

    @props.imagePromise
      .then (src) =>
        card.style.backgroundImage = "url('#{src}')"
        card.style.backgroundSize = "contain"
      .catch =>
        card.style.background = "url('./assets/simple-pattern.jpg') center center repeat"

  render: ->
    <div className="card" ref="ownedCard">
      <PromiseRenderer promise={@resourceOwner()} pending={null}>{(owner) =>
        linkProps =
          to: @props.linkTo
          params:
            owner: owner?.login ? 'LOADING'
            name: @props.resource.slug

        <FlexibleLink {...linkProps}>
          <svg className="card-space-maker" viewBox="0 0 2 1" width="100%" height="150px"></svg>
          <div className="details">
            <div className="name">{@props.resource.display_name}</div>
            <div className="owner">{owner?.display_name ? 'LOADING'}</div>
            <button type="button" tabIndex="-1" className="ghost-button card-button"><Translate content={"#{@props.translationObjectName}.button"} /></button>
          </div>
        </FlexibleLink>
      }</PromiseRenderer>
    </div>
