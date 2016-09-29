React = require 'react'
talkClient = require 'panoptes-client/lib/talk-client'
{Link} = require 'react-router'

ProjectTag = (props) ->
  tag = props.tag.name
  <div className="truncated">
    <Link to="/projects/#{props.project.slug}/talk/tags/#{tag}" onClick={props.onClick} >
      #{tag}
    </Link>
    {' '}
  </div>

TalkTag = (props) ->
  tag = props.tag.name
  <div className="truncated">
    <Link to="/talk/search/?query=#{tag}" onClick={props.onClick} >
      #{tag}
    </Link>
    {' '}
  </div>
  
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

  render: ->
    <div className="talk-popular-tags">
      {if @state.tags?.length
        <div>
          {@props.header ? null}
          <section>
            {@state.tags.map (tag) =>
              logClick = @context.geordi?.makeHandler? 'hashtag-sidebar'
              if @props.project
                <ProjectTag key={tag.id} project={@props.project} tag={tag} onClick={logClick?.bind(this, tag)} />
              else
                <TalkTag key={tag.id} tag={tag} onClick={logClick?.bind(this, tag)} />
            }
          </section>
        </div>
      }
    </div>
