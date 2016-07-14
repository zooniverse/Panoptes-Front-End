React = require 'react'
apiClient = require 'panoptes-client/lib/api-client'
PromiseRenderer = require '../../components/promise-renderer'
CollectionCard = require '../../partials/collection-card'
Translate = require 'react-translate-component'
{Link} = require 'react-router'
CollectionsNav = require './nav'
classNames = require 'classnames'

List = React.createClass
  displayName: 'List'

  componentDidMount: ->
    document.documentElement.classList.add 'on-secondary-page'

  componentWillUnmount: ->
    document.documentElement.classList.remove 'on-secondary-page'

  imagePromise: (collection) ->
    apiClient.type('subjects').get(collection_id: collection.id, page_size: 1)
      .then ([subject]) ->
        if subject?
          firstKey = Object.keys(subject.locations[0])[0]
          subject.locations[0][firstKey]
        else
          '/simple-avatar.jpg'

  cardLink: (collection) ->
    baseLink = "/"
    if @props.project?
      baseLink += "projects/#{@props.project.slug}/"
    "#{baseLink}collections/#{collection.slug}"

  listCollections: ->
    query = {}
    if @props.params?.collection_owner?
      query.owner = @props.params.collection_owner
      query.include = 'owner'
    if @props.project?
      query.project_ids = @props.project.id
    query.favorite = @props.favorite
    Object.assign query, @props.location.query

    apiClient.type('collections').get query

  render: ->
    {location} = @props
    classes = classNames {
      "resources-container": true
      "collections-container": true
      "in-project-context": @props.project?
    }

    baseLink = if @props.project? then "/projects/#{@props.project.slug}/" else "/"
    baseType = if @props.favorite then "favorites" else "collections"
    shouldShowMoreLink = @props.params.profile_name? || @props.params.collection_owner?
    showMoreLink = "#{baseLink}#{baseType}/"
    shouldShowSubMenu = @props.project? && !@props.params.profile_name?
    shouldShowZooWideLink = @props.project? && !shouldShowMoreLink
    showZooWideLink = "/#{baseType}/"
    shouldShowUserWideLink = @props.project? && shouldShowMoreLink
    userForUserWideLink = if @props.params.profile_name? then @props.params.profile_name else @props.params.collection_owner
    showUserWideLink = "/users/#{userForUserWideLink}/#{baseType}"

    <section className={classes}>
      {if shouldShowSubMenu
        <CollectionsNav
          translationObjectName="#{@props.translationObjectName}"
          user={@props.user}
          project={@props.project} />}
      <PromiseRenderer promise={@listCollections()}>{(collections) =>
        if collections?.length > 0
          meta = collections[0].getMeta()
          <div>
            <div className="resource-results-counter collection-results-counter">
              <p>
                {if meta
                  pageStart = meta.page * meta.page_size - meta.page_size + 1
                  pageEnd = Math.min(meta.page * meta.page_size, meta.count)
                  count = meta.count
                  <Translate pageStart={pageStart} pageEnd={pageEnd} count={count} content="#{@props.translationObjectName}.countMessage" />}
                {if shouldShowMoreLink
                  <Link className="show-more" to="#{showMoreLink}">
                    <Translate content="#{@props.translationObjectName}.more" />
                  </Link>}
                {if shouldShowZooWideLink
                  <Link className="show-more" to="#{showZooWideLink}">
                    <Translate content="#{@props.translationObjectName}.zooWide" />
                  </Link>}
                {if shouldShowUserWideLink
                  <Link className="show-more" to="#{showUserWideLink}">
                    <Translate content="#{@props.translationObjectName}.userWide" user="#{userForUserWideLink}"/>
                  </Link>}
              </p>
            </div>
            <div className="collections-card-list">
              {for collection in collections
                 <CollectionCard
                   key={collection.id}
                   collection={collection}
                   imagePromise={@imagePromise(collection)}
                   linkTo={@cardLink(collection)}
                   translationObjectName={@props.translationObjectName}
                   skipOwner={@props.params?.collection_owner?} />}
            </div>
            <nav>
              {if meta
                <nav className="pagination">
                  {for page in [1..meta.page_count]
                    active = (page is +location.query.page) or (page is 1 and not location.search)
                    <Link
                      key={page}
                      to={"#{@props.location.pathname}?page=#{page}"}
                      activeClassName="active"
                      className="pill-button"
                      style={border: "2px solid" if active}>
                      {page}
                    </Link>}
                </nav>}
            </nav>
          </div>
        else if collections?.length is 0
          <Translate content="#{@props.translationObjectName}.notFoundMessage" component="div" />
        else
          <Translate content="#{@props.translationObjectName}.loadMessage" component="div" />
      }</PromiseRenderer>
    </section>

module.exports = List
