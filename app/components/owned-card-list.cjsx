counterpart = require 'counterpart'
React = require 'react'
TitleMixin = require '../lib/title-mixin'
Translate = require 'react-translate-component'
apiClient = require 'panoptes-client/lib/api-client'
PromiseRenderer = require '../components/promise-renderer'
OwnedCard = require '../partials/owned-card'
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

  getMessageKeyToUseForTitle: ->
    console.log @props.filter
    console.log @props.filter?, "project_ids" of @props.filter, "owner" of @props.filter, @viewingOwnCollections
    if @props.filter?
      if "project_ids" of @props.filter
        if "owner" of @props.filter
          if @viewingOwnCollections
            "#{@props.translationObjectName}.title.project.ownedBySelf"
          else
            "#{@props.translationObjectName}.title.project.ownedByOther"
        else
          "#{@props.translationObjectName}.title.project.allOwners"
      else
        if "owner" of @props.filter
          if @viewingOwnCollections
            "#{@props.translationObjectName}.title.allProjects.ownedBySelf"
          else
            "#{@props.translationObjectName}.title.allProjects.ownedByOther"
        else
          "#{@props.translationObjectName}.title.allProjects.allOwners"
    else
      "#{@props.translationObjectName}.title.generic"

  getOwnerForTitle: ->
    console.log "nbo",@props.nonBreakableOwnerName
    if @props.filter? and "owner" of @props.filter
      return @props.nonBreakableOwnerName

  getProjectForTitle: ->
    if @props.filter? and "project_ids" of @props.filter
      return @props.nonBreakableProjectName

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
          <Translate component="h1" owner={@getOwnerForTitle()} project={@getProjectForTitle()} content={"#{@getMessageKeyToUseForTitle()}"} />
          {if @props.heroNav?
            @props.heroNav}
        </div>
      </section>
      <section className="resources-container">
        <PromiseRenderer promise={@props.listPromise}>{(ownedResources) =>
          if ownedResources?.length > 0
            meta = ownedResources[0].getMeta()
            <div>
              <div className="resource-results-counter">
                {if meta
                  pageStart = meta.page * meta.page_size - meta.page_size + 1
                  pageEnd = Math.min(meta.page * meta.page_size, meta.count)
                  count = meta.count
                  <Translate pageStart={pageStart} pageEnd={pageEnd} count={count} content="#{@props.translationObjectName}.countMessage" component="p" />}
              </div>
              <div className="card-list">
                {for resource in ownedResources
                   <OwnedCard
                     key={resource.id}
                     resource={resource}
                     imagePromise={@props.imagePromise(resource)}
                     linkTo={@props.cardLink(resource)}
                     translationObjectName={@props.translationObjectName}
                     skipOwner={@props.skipOwner} />}
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
            <Translate content="#{@props.translationObjectName}.notFoundMessage" component="div" />
          else
            <Translate content="#{@props.translationObjectName}.loadMessage" component="div" />
        }</PromiseRenderer>
      </section>
    </div>
