React = require 'react'
PropTypes = require 'prop-types'
createReactClass = require 'create-react-class'
{Link} = require 'react-router'
talkClient = require 'panoptes-client/lib/talk-client'
apiClient = require 'panoptes-client/lib/api-client'
Paginator = require './lib/paginator'
getSubjectLocation = require '../lib/get-subject-location'
resourceCount = require './lib/resource-count'
ProjectLinker = require './lib/project-linker'
Loading = require('../components/loading-indicator').default

`import ActiveUsers from './active-users';`
`import PopularTags from './popular-tags';`
`import Thumbnail from '../components/thumbnail';`

module.exports = createReactClass
  displayName: 'TalkTags'

  contextTypes:
    router: PropTypes.object.isRequired

  getInitialState: ->
    tags: null
    meta: { }

  componentDidMount: ->
    @getTags()

  componentWillReceiveProps: (nextProps) ->
    pageChanged = nextProps.location.query.page isnt @props.location.query.page
    differentTag = nextProps.params.tag isnt @props.params.tag

    if pageChanged or differentTag
      nextPage = if differentTag then 1 else nextProps.location.query.page
      @getTags nextPage, nextProps.params.tag

  getTags: (page = @props.location.query.page, name = @props.params.tag) ->
    page or= 1
    taggable_type = 'Subject'
    section = "project-#{ @props.project.id }"

    talkClient.type('tags/popular').get({page, taggable_type, section, name}).then (tags) =>
      meta = tags[0]?.getMeta()
      Promise.all tags.map (tag) =>
        apiClient.type('subjects').get(tag.taggable_id.toString()).then (subject) =>
          taggable_id = subject.id
          talkClient.type('tags/popular').get({taggable_type, taggable_id}).then (subjectTags) =>
            tag.update {subject, subjectTags}
      .then (tags) =>
        @setState {tags, meta}

  render: ->
    <div className="talk-search">
      <h1>Subjects tagged with #{@props.params.tag}</h1>

      <button className="link-style" type="button" onClick={@context.router.goBack}>
        <i className="fa fa-backward" /> Back
      </button>

      {if @state.tags?.length > 0
        <div className="talk-search-container">
          <div className="talk-search-counts">
            Your search returned {resourceCount @state.meta.count, 'subjects'}.
          </div>

          <Paginator page={+@state.meta.page} pageCount={@state.meta.page_count} />

          <div className="talk-search-results">
            <div className="talk-list-content">
              <section className="tagged-results">
                {for tag in @state.tags
                  <div className="tagged-subject talk-module" key="tag-#{ tag.id }">
                    <p>
                      <Link to="/projects/#{@props.params.owner}/#{@props.params.name}/talk/subjects/#{tag.subject.id}">
                        Subject {tag.subject.id}
                      </Link>
                    </p>
                    <Thumbnail
                      src={getSubjectLocation(tag.subject).src}
                      width={300}
                      type={getSubjectLocation(tag.subject).type}
                      format={getSubjectLocation(tag.subject).format}
                      />
                    <ul className="tag-list">
                      {for subjectTag in tag.subjectTags
                        <li key={"tag-#{ tag.id }-#{ subjectTag.id }"}>
                          <Link to="/projects/#{@props.params.owner}/#{@props.params.name}/talk/tags/#{subjectTag.name}" {...@props}>
                            #{subjectTag.name}
                          </Link>
                        </li>}
                    </ul>
                  </div>
                }
              </section>

              <div className="talk-sidebar">
                <section>
                  <PopularTags
                    header={<h3>Popular Tags:</h3>}
                    section={@props.section}
                    project={@props.project} />
                </section>

                <section>
                  <ActiveUsers section={@props.section} project={@props.project}/>
                </section>

                <section>
                  <h3>Projects:</h3>
                  <ProjectLinker user={@props.user} />
                </section>
              </div>
            </div>

            <Paginator page={+@state.meta.page} pageCount={@state.meta.page_count} />
          </div>
        </div>
      else if @state.tags
        <p>No tags found.</p>
      else
        <Loading />
      }
    </div>
