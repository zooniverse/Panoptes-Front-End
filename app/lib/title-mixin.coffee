MAIN_SEPARATOR = ' » '
SUFFIX_SEPARATOR = ' \u2014 ' # Em dash
SUFFIX = document?.title

titleSegments = []

module.exports =
  _titleSegmentIndex: NaN

  componentDidMount: ->
    @_titleSegmentIndex = titleSegments.length
    @updateTitle()

  componentWillUnmount: ->
    titleSegments.splice @_titleSegmentIndex # All children are unmounting too.
    @_titleSegmentIndex = NaN
    @updateTitle()

  componentDidUpdate: ->
    @updateTitle()

  updateTitle: ->
    titleSegments[@_titleSegmentIndex] = if typeof @title is 'function'
      @title()
    else
      @title

    mainTitle = titleSegments.filter(Boolean).join MAIN_SEPARATOR
    document?.title = [mainTitle, SUFFIX].filter(Boolean).join SUFFIX_SEPARATOR
