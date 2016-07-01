React = require 'react'
apiClient = require 'panoptes-client/lib/api-client'
PromiseRenderer = require '../../components/promise-renderer'
CollectionCard = require '../../partials/collection-card'
Translate = require 'react-translate-component'
{Link} = require 'react-router'

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
    [collection_owner, collection_name] = collection.slug.split('/')
    "/collections/#{collection_owner}/#{collection_name}"

  listCollections: ->
    query = {}
    if @props.params?.collection_owner?
      query.owner = @props.params.collection_owner
      query.include = 'owner'

    query.favorite = @props.favorite
    Object.assign query, @props.location.query

    apiClient.type('collections').get query

  render: ->
    {location} = @props
    <section className="resources-container collections-container">
      <PromiseRenderer promise={@listCollections()}>{(collections) =>
        if collections?.length > 0
          meta = collections[0].getMeta()
          <div>
            <div className="resource-results-counter collection-results-counter">
              {if meta
                pageStart = meta.page * meta.page_size - meta.page_size + 1
                pageEnd = Math.min(meta.page * meta.page_size, meta.count)
                count = meta.count
                <Translate pageStart={pageStart} pageEnd={pageEnd} count={count} content="#{@props.translationObjectName}.countMessage" component="p" />}
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
                      to={"#{@props.linkTo}?page=#{page}"}
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
