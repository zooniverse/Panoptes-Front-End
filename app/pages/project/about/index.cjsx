React = require 'react'
TitleMixin = require '../../../lib/title-mixin'
{Markdown} = require 'markdownz'
ChangeListener = require '../../../components/change-listener'
PromiseRenderer = require '../../../components/promise-renderer'
{Link} = require 'react-router'

module.exports = React.createClass
  displayName: 'About'

  mixins: [TitleMixin]

  title: 'About'

  getDefaultProps: ->
    project: null

  getPageTitles: (page) ->
    page.filter((page) -> page.content isnt '' and page.content?)
      .reduce(((accum, page) -> accum[page.url_key] = page.title; accum), {})

  render: ->
    <ChangeListener target={@props.project}>{=>
      <PromiseRenderer promise={@props.project.get 'owner'}>{(owner) =>
        [ownerName, name] = @props.project.slug.split('/')
        projectPath = "/projects/#{ownerName}/#{name}"

        <div className="project-text-content content-container">
          <PromiseRenderer promise={@props.project.get 'pages'}>{(pages) =>
            pageTitles = @getPageTitles(pages)
            <span>
              {if pageTitles.science_case
                <Link to="#{projectPath}/about/research" activeClassName="active"className="tabbed-content-tab">
                  {pageTitles.science_case}
                </Link>}
              {if pageTitles.results
                <Link to="#{projectPath}/about/results" activeClassName="active"className="tabbed-content-tab">
                  {pageTitles.results}
                </Link>}
              {if pageTitles.faq
                <Link to="#{projectPath}/about/faq" activeClassName="active" className="tabbed-content-tab">
                  {pageTitles.faq}
                </Link>}
              {if pageTitles.education
                <Link to="#{projectPath}/about/education" activeClassName="active" className="tabbed-content-tab">
                  {pageTitles.education}
                </Link>}
              {if pageTitles.team
                <Link to="#{projectPath}/about/team" activeClassName="active" className="tabbed-content-tab">
                  {pageTitles.team}
                </Link>}
            </span>
          }</PromiseRenderer>

          {React.cloneElement(@props.children, {owner: owner, project: @props.project, user: @props.user})}

        </div>
      }</PromiseRenderer>
    }</ChangeListener>
