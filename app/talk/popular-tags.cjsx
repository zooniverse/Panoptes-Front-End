React = require 'react'
PromiseRenderer = require '../components/promise-renderer'
{makeHTTPRequest} = require 'json-api-client'
{Link} = require 'react-router'

module?.exports = React.createClass
  displayName: 'TalkPopularTags'

  propTypes:
    header: React.PropTypes.object             # Optional header ex: <h1>Tags</h1>
    section: React.PropTypes.string.isRequired # Talk section
    params: React.PropTypes.object.isRequired # URL params

  tagsRequest: ->
    talkClient.type('tags/popular').get section: @props.section, limit: 10

  tag: (tag, i) ->
    {owner, name} = @props.params
    if owner and name
      <span key={i}><Link params={{owner, name}} query={query: tag.name} to="project-talk-search">#{tag.name}</Link>{' '}</span>
    else
      <span key={i}><Link query={query: tag.name} to="talk-search">#{tag.name}</Link>{' '}</span>

  render: ->
    <div className="talk-popular-tags">
      <PromiseRenderer promise={@tagsRequest()}>{(tags) =>
        if tags?.length
          <div>
            {@props.header ? null}
            {tags.map(@tag)}
          </div>
      }</PromiseRenderer>
    </div>
