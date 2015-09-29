React = require 'react'
PromiseRenderer = require '../components/promise-renderer'
{Link} = require '@edpaget/react-router'

module?.exports = React.createClass
  displayName: 'TalkPopularTags'

  propTypes:
    header: React.PropTypes.object             # Optional header ex: <h1>Tags</h1>
    section: React.PropTypes.string.isRequired # Talk section
    params: React.PropTypes.object.isRequired # URL params

  tagsRequest: ->
    talkClient.type('tags/popular').get section: @props.section, limit: 20, page_size: 20

  tag: (tag, i) ->
    {owner, name} = @props.params
    if owner and name
      <div key={tag.id}><Link params={{owner, name}} query={query: tag.name} to="project-talk-search">#{tag.name}</Link>{' '}</div>
    else
      <div key={tag.id}><Link query={query: tag.name} to="talk-search">#{tag.name}</Link>{' '}</div>

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
