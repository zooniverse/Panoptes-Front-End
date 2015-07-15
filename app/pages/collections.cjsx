counterpart = require 'counterpart'
React = require 'react'
TitleMixin = require '../lib/title-mixin'
apiClient = require '../api/client'
authClient = require '../api/auth'
OwnedCardList = require '../components/owned-card-list'
PromiseRenderer = require '../components/promise-renderer'
ChangeListener = require '../components/change-listener'
Translate = require 'react-translate-component'
{Link} = require 'react-router'

counterpart.registerTranslations 'en',
  collectionsPage:
    title: '%(user)s Collections'
    countMessage: 'Showing %(count)s found'
    button: 'View Collection'
    loadMessage: 'Loading Collections'
    notFoundMessage: 'No Collections Found'
    myCollections: 'My Collections'

CollectionsNav = React.createClass
  displayName: 'CollectionsNav'

  render: ->
    <nav className="hero-nav">
      <PromiseRenderer promise={authClient.checkCurrent()}>{(user) ->
        if user?
          <Link to="collections-user" params={{owner: user.login}}>
            <Translate content="collectionsPage.myCollections" />
          </Link>
      }</PromiseRenderer>
    </nav>

CollectionsPage = React.createClass
  displayName: 'CollectionsPage'

  mixins: [TitleMixin]

  title: 'Collections'

  imagePromise: (collection) ->
    apiClient.type('subjects').get(collection_id: collection.id, page_size: 1)
    .index(0)
    .then (subject) ->
      firstKey = Object.keys(subject.locations[0])[0]
      subject.locations[0][firstKey]

  cardLink: (collection) ->
    'collection-show'

  listCollections: ->
    query = {}
    query.owner = @props.params.owner if @props.params?.owner?
    query.include = 'owner'
    Object.assign query, @props.query

    apiClient.type('collections').get query

  render: ->
    <OwnedCardList
      translationObjectName="collectionsPage"
      listPromise={@listCollections()}
      linkTo="collections"
      heroNav={<CollectionsNav />}
      heroClass="collections-hero"
      ownerName={@props.params?.owner}
      imagePromise={@imagePromise}
      cardLink={@cardLink} />

module.exports = React.createClass
  displayName: 'CollectionsPageWrapper'

  render: ->
    <ChangeListener target={authClient} handler={=>
      <CollectionsPage {...@props} />
    }/>
