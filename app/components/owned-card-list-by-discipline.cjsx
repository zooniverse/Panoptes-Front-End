counterpart = require 'counterpart'
React = require 'react'
TitleMixin = require '../lib/title-mixin'
Translate = require 'react-translate-component'
apiClient = require '../api/client'
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

  componentDidMount: ->
    document.documentElement.classList.add 'on-secondary-page'

  componentWillUnmount: ->
    document.documentElement.classList.remove 'on-secondary-page'

  userForTitle: ->
    if @props.ownerName
      "#{@props.ownerName}'s"
    else
      'All'

  getDisciplines: -> [
   'astronomy',
   'physics',
   'nature',
   'biology',
   'climate',
   'history',
   'literature',
   'arts',
   'language',
   'medicine',
   'social science',
   'humanitarian'
  ]

  getResourceList: (discipline,ownedResources) ->
    for resource in ownedResources[..4]
      <OwnedCard
        key={resource.id}
        resource={resource}
        imagePromise={@props.imagePromise(resource)}
        linkTo={@props.cardLink(resource)}
        translationObjectName={@props.translationObjectName}/>

  render: ->
    <div className="secondary-page all-resources-page">
      <section className={"hero #{@props.heroClass}"}>
        <div className="hero-container">
          <Translate component="h1" user={@userForTitle()} content={"#{@props.translationObjectName}.title"} />
          {if @props.heroNav?
            @props.heroNav}
        </div>
      </section>
      <section className="resources-container">
        <PromiseRenderer promise={@props.listPromise}>{(ownedResources) =>
          if ownedResources?.length > 0
            meta = ownedResources[0].getMeta()
            <div>
              <div className="discipline-list">
                {for discipline in @getDisciplines()
                  <div className="discipline-section">
                    <h2 className="discipline-title">{discipline}</h2>
                    <div className="card-list">
                      {@getResourceList(discipline,ownedResources)}
                    </div>
                  </div>
                }
              </div>
            </div>
          else if ownedResources?.length is 0
            <Translate content="#{@props.translationObjectName}.notFoundMessage" component="div" />
          else
            <Translate content="#{@props.translationObjectName}.loadMessage" component="div" />
        }</PromiseRenderer>
      </section>
    </div>
