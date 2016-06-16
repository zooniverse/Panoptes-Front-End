counterpart = require 'counterpart'
React = require 'react'
TitleMixin = require '../lib/title-mixin'
Translate = require 'react-translate-component'
apiClient = require 'panoptes-client/lib/api-client'
PromiseRenderer = require '../components/promise-renderer'
OwnedCard = require '../partials/owned-card'
ContextualLinks = require '../lib/contextual-links'
{Link} = require 'react-router'

module.exports = React.createClass
  displayName: 'OwnedCardList'

  propTypes:
    imagePromise: React.PropTypes.func.isRequired
    listPromise: React.PropTypes.object.isRequired
    cardLink: React.PropTypes.func.isRequired
    translationObjectName: React.PropTypes.string.isRequired
    ownerName: React.PropTypes.string
    heroClass: React.PropTypes.string
    heroNav: React.PropTypes.node
    skipOwner: React.PropTypes.bool

  componentDidMount: ->
    document.documentElement.classList.add 'on-secondary-page'

  componentWillUnmount: ->
    document.documentElement.classList.remove 'on-secondary-page'

  getPageClasses: ->
    classes = 'secondary-page all-resources-page'
    if @props.project?
      classes += ' has-project-context'
    classes

  render: ->
    {location} = @props
    <div className={@getPageClasses()}>
      <section className={"hero #{@props.heroClass}"}>
        <div className="hero-container">
          <Translate component="h1" collectionOwnerName={@props.titleMessageObject.user?.displayName} projectDisplayName={@props.titleMessageObject.project?.displayName} content={"#{@props.titleMessageObject.messageKey}"} />
          {if @props.heroNav? and !@props.project?
            @props.heroNav}
        </div>
      </section>
      <section className="resources-container">
        {if @props.heroNav? and @props.project?
            @props.heroNav}
        <PromiseRenderer promise={@props.listPromise}>{(ownedResources) =>
          if ownedResources?.length > 0
            meta = ownedResources[0].getMeta()
            classNames = "resource-results-counter"
            if meta and @props.removeProjectContextLink?
              classNames += " remove-project-context-link-follows"
            <div>
              <div className={classNames}>
                {if meta
                  pageStart = meta.page * meta.page_size - meta.page_size + 1
                  pageEnd = Math.min(meta.page * meta.page_size, meta.count)
                  count = meta.count
                  <Translate pageStart={pageStart} pageEnd={pageEnd} count={count} content="#{@props.translationObjectName}.countMessage" component="p" />}
                {if @props.removeProjectContextLink?
                  link = @props.removeProjectContextLink
                  <p className="remove-project-context-link">
                    <Link key="#{link.key}" to="#{link.to}" title="#{link.message.hoverText}" activeClassName="active">
                      <Translate content="#{link.message.messageKey}" projectDisplayName={link.message.project?.displayName} collectionOwnerName={link.message.user?.displayName} />
                    </Link>
                  </p>}
              </div>
              <div className="owned-card-list">
                {for resource in ownedResources
                   <OwnedCard
                     key={resource.id}
                     resource={resource}
                     imagePromise={@props.imagePromise(resource)}
                     linkTo={@props.cardLink(resource)}
                     translationObjectName={@props.translationObjectName}
                     skipOwner={!ContextualLinks.shouldShowCollectionOwner(@props)} />}
              </div>
              <nav>
                {if meta
                  <nav className="pagination">
                    {for page in [1..meta.page_count]
                      active = (page is +location.query.page) or (page is 1 and not location.search)
                      <Link
                        key={page}
                        to={"#{@props.linkTo}?page=#{page}"}
                        activeClassName="active"
                        className="pill-button"
                        style={border: "2px solid" if active}>
                        {page}
                      </Link>}
                  </nav>}
              </nav>
            </div>
          else if ownedResources?.length is 0
            <Translate content="#{@props.translationObjectName}.notFoundMessage" component="div" className="error"/>
          else
            <Translate content="#{@props.translationObjectName}.loadMessage" component="div" className="loading"/>
        }</PromiseRenderer>
      </section>
    </div>
