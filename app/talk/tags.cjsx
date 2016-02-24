React = require 'react'
{Link, History} = require 'react-router'
talkClient = require 'panoptes-client/lib/talk-client'
apiClient = require 'panoptes-client/lib/api-client'
Paginator = require './lib/paginator'
SubjectViewer = require '../components/subject-viewer'
resourceCount = require './lib/resource-count'
Loading = require '../components/loading-indicator'
PopularTags = require './popular-tags'
ActiveUsers = require './active-users'
ProjectLinker = require './lib/project-linker'
SidebarNotifications = require './lib/sidebar-notifications'

module.exports = React.createClass
  displayName: 'TalkTags'
  mixins: [History]

  getInitialState: ->
    tags: null
    meta: { }

  componentDidMount: ->
    @getTags()

  componentWillReceiveProps: (nextProps) ->
    pageChanged = nextProps.location.query.page isnt @props.location.query.page
    differentTag = nextProps.params.tag isnt @props.params.tag

    if pageChanged or differentTag
      @getTags(nextProps.location.query.page, nextProps.params.tag)

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

      <button className="link-style" type="button" onClick={@history.goBack}>
        <i className="fa fa-backward" /> Back
      </button>

      {if @state.tags?.length > 0
        <div className="talk-search-container">
          <div className="talk-search-counts">
            Your search returned {resourceCount @state.meta.count, 'subjects'}.
          </div>

          <div className="talk-search-results">
            <div className="talk-list-content">
              <section>
                {for tag in @state.tags
                  <div className="tagged-subject talk-search-result talk-module" key="tag-#{ tag.id }">
                    <p>
                      <Link to="/projects/#{@props.params.owner}/#{@props.params.name}/talk/subjects/#{tag.subject.id}">
                        Subject {tag.subject.id}
                      </Link>
                    </p>
                    <SubjectViewer subject={tag.subject} user={@props.user} project={@props.project}/>
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
                <SidebarNotifications {...@props} />

                <section>
                  <PopularTags
                    header={<h3>Popular Tags:</h3>}
                    section={@props.section}
                    project={@props.project} />
                </section>

                <section>
                  <ActiveUsers section={@props.section} />
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
