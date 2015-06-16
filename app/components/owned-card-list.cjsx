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

  componentDidMount: ->
    document.documentElement.classList.add 'on-secondary-page'

  componentWillUnmount: ->
    document.documentElement.classList.remove 'on-secondary-page'

  render: ->
    <div className="secondary-page all-resources-page">
      <section className="hero projects-hero">
        <div className="hero-container">
          <Translate component="h1" content={"#{@props.translationObjectName}.title"} />
        </div>
      </section>
      <section className="resources-container">
        <PromiseRenderer promise={@props.listPromise}>{(ownedResources) =>
          if ownedResources?.length > 0
            <div>
              <div className="resource-results-counter">
                <Translate count={ownedResources.length} content="#{@props.translationObjectName}.countMessage" component="p" />
              </div>
              <div className="card-list">
                {for resource in ownedResources
                   <OwnedCard
                     key={resource.id}
                     resource={resource}
                     imagePromise={resource.get(@props.imageProperty)}
                     linkTo={@props.cardLink}
                     translationObjectName={@props.translationObjectName}/>}
              </div>
              <nav>
                {if meta = ownedResources[0].getMeta()
                  <nav className="pagination">
                    {for page in [1..meta.page_count]
                      <Link to={@props.linkTo} query={{page}} key={page} className="pill-button">{page}</Link>}
                  </nav>}
              </nav>
            </div>
          else if ownedResources?.length = 0
            <Translate content="#{@props.translationObjectName}.notFoundMessage" component="div" />
          else
            <Translate content="#{@props.translationObjectName}.loadMessage" component="div" />
        }</PromiseRenderer>
      </section>
    </div>
