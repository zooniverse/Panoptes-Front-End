React = require 'react'
PropTypes = require 'prop-types'
createReactClass = require 'create-react-class'
ReactDOM = require 'react-dom'
talkClient = require 'panoptes-client/lib/talk-client'
Loading = require('../components/loading-indicator').default
getCaretPosition = require './lib/get-caret-position'

module.exports = createReactClass
  displayName: 'Suggester'

  propTypes:
    input: PropTypes.string.isRequired
    onSelect: PropTypes.func

  getDefaultProps: ->
    onSelect: ->

  getInitialState: ->
    data: []
    loading: false
    open: false
    kind: null
    pendingSearch: null
    lastSearch: null
    id: null

  componentDidMount: ->
    textArea = ReactDOM.findDOMNode(@).querySelector 'textarea'
    @setState textArea: textArea, id: Date.now().toString(16)
    textArea.addEventListener 'click', @handleInput

  componentWillUnmount: ->
    @state.textArea.removeEventListener 'click', @handleInput
    mimic.remove() for mimic in document.querySelectorAll('[id^="mimic-textarea-"]')

  componentWillReceiveProps: (nextProps) ->
    @handleInput() if @state.textArea

  show: (kind) ->
    return if @state.open
    @reposition()
    @refs.suggestions.style.display = 'block'
    @setState open: true, kind: kind, data: []

  reposition: ->
    position = getCaretPosition @state.id, @state.textArea, @refs.suggestions, @state.textArea.selectionEnd
    @refs.suggestions.style.top = "#{position.top}px"
    @refs.suggestions.style.left = "#{position.left}px"

  hide: ->
    return unless @state.open
    @refs.suggestions.style.display = 'none'
    @setState @getInitialState()

  defer: (search) ->
    if @state.loading or @debounce()
      @setState pendingSearch: search
      true

  debounce: ->
    timeSince = Date.now() - @state.lastSearch
    tooSoon = timeSince < 300

    if tooSoon
      setTimeout =>
        if pendingSearch = @state.pendingSearch
          @setState pendingSearch: null
          @searchFor pendingSearch
      , 300 - timeSince

    tooSoon

  getTags: (search) ->
    section = if @props.project then "project-#{@props.project.id}" else 'zooniverse'
    @get 'tags/autocomplete', {search, section}

  getUsers: (search) ->
    @get 'users/autocomplete', {search}

  get: (resource, params) ->
    return if @defer params.search
    @setState loading: true, lastSearch: new Date()
    talkClient.type(resource).get(params).then @handleResults

  handleResults: (results) ->
    if pendingSearch = @state.pendingSearch
      @setState data: results, loading: false, pendingSearch: null
      @searchFor pendingSearch
    else
      @setState data: results, loading: false

  searchFor: (search = '', kind) ->
    search = search.toLowerCase().replace /[@#]+/g, ''
    kind or= @state.kind
    @show kind

    if kind is 'usernames'
      @getUsers search
    else if kind is 'tags'
      @getTags search

  lastWord: ->
    words = @state.textArea.value.substr(0, @state.textArea.selectionEnd).split /\s/m
    words[words.length - 1]

  currentTrigger: ->
    if @state.kind is 'usernames'
      '@'
    else if @state.kind is 'tags'
      '#'

  title: ->
    if @state.kind is 'usernames'
      'Mention a user'
    else if @state.kind is 'tags'
      'Use a tag'

  handleInput: ->
    lastWord = @lastWord()
    @reposition() if @state.open
    @hide() if lastWord.match(/^(\@|\#)/)?[1] isnt @currentTrigger()

    if lastWord.match(/^\@/)
      @searchFor lastWord, 'usernames'
    else if lastWord.match(/^\#/)
      @searchFor lastWord, 'tags'

  moveCaretTo: (position) ->
    @state.textArea.focus()

    if @state.textArea.setSelectionRange
      @state.textArea.setSelectionRange position, position
    else if @state.textArea.createTextRange
      range = @state.textArea.createTextRange()
      range.collapse true
      range.moveEnd 'character', position
      range.moveStart 'character', position
      range.select()

  choose: (value) ->
    lastWord = @lastWord()
    endingPosition = @state.textArea.selectionEnd
    startingPosition = endingPosition - lastWord.length
    beginning = @state.textArea.value.substr 0, startingPosition
    ending = @state.textArea.value.substr endingPosition, @state.textArea.value.length
    @state.textArea.value = "#{beginning}#{value} #{ending.replace(/^ /, '')}"
    @moveCaretTo startingPosition + value.length + 1
    @hide()

    # Pass a fake input change event
    @props.onSelect target: @state.textArea

  render: ->
    <div className="suggester">
      {@props.children}
      <div ref="suggestions" className={"suggestions suggest-#{@state.kind}"}>
        <p className="title">
          {@title()}
          <span className={"loading #{if @state.loading or @state.pendingSearch then 'shown' else ''}"}>
            <Loading />
          </span>
        </p>
        <ul>
          {for datum, i in @state.data
            if @state.kind is 'tags'
              <li className="tag"
                key={"tag-#{i}"}
                onClick={@choose.bind @, "##{datum.name}"}>
                {datum.name}
              </li>
            else if @state.kind is 'usernames'
              <li className="user"
                key={"username-#{i}"}
                onClick={@choose.bind @, "@#{datum.login}"}>
                @{datum.login} <small>{datum.display_name}</small>
              </li>}
        </ul>
      </div>
    </div>
