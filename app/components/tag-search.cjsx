React = require 'react'
PropTypes = require 'prop-types'
createReactClass = require 'create-react-class'
Select = require('react-select').default
apiClient = require 'panoptes-client/lib/api-client'

module.exports = createReactClass
  displayName: 'TagSearch'

  propTypes:
    multi: PropTypes.bool
    value: PropTypes.array

  getDefaultProps: ->
    multi: true
    value: []
  
  getInitialState: ->
    tags: []
  
  componentWillMount: ->
    @setState tags: @props.value
  
  componentWillReceiveProps: (newProps) ->
    @setState tags: newProps.value unless newProps.value is @state.tags

  onChange: (options) ->
    tags = options.map (option) ->
      option.value
    @setState {tags}
    @props.onChange options

  searchTags: (value, callback) ->
    if value is ''
      callback null, {}
    else
      apiClient.type('tags').get search: "#{value}", page_size: 10
        .then (tags) =>
          opts = for tag in tags
            { value: tag.name, label: tag.name }
          { options: opts }

  saveCurrent: ({target}) ->
    tags = @state.tags
    unless target.value is ''
      tags.push target.value
      @setState {tags}
      options = tags.map (tag) ->
        label: tag, value: tag
      @props.onChange options

  render: ->
    value = @state.tags.map (tag) ->
      {label: tag, value: tag}
    <Select.Async
      ref="tagSearch"
      multi={@props.multi}
      name={@props.name}
      value={value}
      placeholder="Tags:"
      className="search standard-input"
      closeAfterClick={false}
      onBlur={@saveCurrent}
      onChange={@onChange}
      loadOptions={@searchTags} />
