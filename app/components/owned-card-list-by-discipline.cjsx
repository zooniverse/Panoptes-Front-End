counterpart = require 'counterpart'
React = require 'react'
TitleMixin = require '../lib/title-mixin'
Translate = require 'react-translate-component'
apiClient = require '../api/client'
PromiseRenderer = require '../components/promise-renderer'
OwnedCard = require '../partials/owned-card'
Select = require 'react-select'
{Link} = require '@edpaget/react-router'
{DISCIPLINES} = require '../components/disciplines'

DisciplineSectionRenderer = React.createClass
  displayName: 'DisciplineSectionRenderer'

  render: ->
    console.log @props.discipline
    <PromiseRenderer promise={@props.getListPromiseFunction(@props.discipline.value)}>{(ownedResources) =>
      if ownedResources?.length > 0
        meta = ownedResources[0].getMeta()
        <div className="discipline-section">
          <img src={"/assets/project-pages/"+@props.discipline.value+".svg"}/><h2 className="discipline-title">{@props.discipline.label}</h2>
          <div className="card-list">
          {
            for resource in ownedResources
              <OwnedCard
                key={resource.id}
                resource={resource}
                imagePromise={@props.imagePromise(resource)}
                linkTo={@props.cardLink(resource)}
                translationObjectName={@props.translationObjectName}/>
          }
          </div>
        </div>}
    </PromiseRenderer>

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

  getInitialState: ->
    listPromise: @props.listPromise
    tagFiler: ""

  componentDidMount: ->
    document.documentElement.classList.add 'on-secondary-page'

  componentWillUnmount: ->
    document.documentElement.classList.remove 'on-secondary-page'

  userForTitle: ->
    if @props.ownerName
      "#{@props.ownerName}'s"
    else
      'All'

  getListPromise: (discipline) ->
    query =
      include:'avatar'
    if !apiClient.params.admin
      query.launch_approved = true
    if !!discipline
      query.tags = discipline
    apiClient.type('projects').get query

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
        <div className="discipline-list">
        {for discipline in DISCIPLINES
          <DisciplineSectionRenderer discipline={discipline} getListPromiseFunction={@getListPromise} {...@props} />
        }
        </div>
      </section>
    </div>
