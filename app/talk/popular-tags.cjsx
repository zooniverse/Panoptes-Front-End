React = require 'react'
PromiseRenderer = require '../components/promise-renderer'
{Link} = require 'react-router'

module?.exports = React.createClass
  displayName: 'TalkPopularTags'

  propTypes:
    header: React.PropTypes.object             # Optional header ex: <h1>Tags</h1>
    section: React.PropTypes.string.isRequired # Talk section
    params: React.PropTypes.object.isRequired # URL params

  tagsRequest: ->
    query =
      section: @props.section
      limit: 20
      page_size: 20

    if @props.type and @props.id
      query.taggable_type = @props.type
      query.taggable_id = @props.id

    talkClient.type('tags/popular').get query

  tag: (talkTag, i) ->
    tag = talkTag.name
    {owner, name} = @props.params
    if owner and name
      <div key={talkTag.id} className="truncated"><Link to="/projects/#{owner}/#{name}/talk/tags/#{tag}">#{tag}</Link>{' '}</div>
    else
      <div key={talkTag.id} className="truncated"><Link to="/talk/search/?query=#{tag}">#{tag}</Link>{' '}</div>

  render: ->
    <div className="talk-popular-tags">
      <PromiseRenderer promise={@tagsRequest()}>{(tags) =>
        if tags?.length
          <div>
            {@props.header ? null}
            <section>{tags.map(@tag)}</section>
          </div>
      }</PromiseRenderer>
    </div>
