React = require 'react'
talkClient = require 'panoptes-client/lib/talk-client'
{Link} = require 'react-router'

module.exports = React.createClass
  displayName: 'TalkPopularTags'

  propTypes:
    header: React.PropTypes.object             # Optional header ex: <h1>Tags</h1>
    section: React.PropTypes.string.isRequired # Talk section

  contextTypes:
    geordi: React.PropTypes.object
  
  getInitialState: ->
    tags: []
  
  componentWillMount: ->
    @tagsRequest()

  tagsRequest: ->
    query =
      section: @props.section
      limit: 20
      page_size: 20

    if @props.type and @props.id
      query.taggable_type = @props.type
      query.taggable_id = @props.id

    talkClient
      .type 'tags/popular'
      .get query
      .then (tags) =>
        @setState {tags}

  tag: (talkTag, i) ->
    logClick = @context.geordi?.makeHandler? 'hashtag-sidebar'
    tag = talkTag.name
    if @props.project
      <div key={"#{talkTag.id}-#{i}"} className="truncated"><Link to="/projects/#{@props.project.slug}/talk/tags/#{tag}" onClick={logClick?.bind(this, tag)}>#{tag}</Link>{' '}</div>
    else
      <div key={"#{talkTag.id}-#{i}"} className="truncated"><Link to="/talk/search/?query=#{tag}" onClick={logClick?.bind(this, tag)}>#{tag}</Link>{' '}</div>

  render: ->
    <div className="talk-popular-tags">
      {if @state.tags?.length
        <div>
          {@props.header ? null}
          <section>{@state.tags.map(@tag)}</section>
        </div>
      }
    </div>
