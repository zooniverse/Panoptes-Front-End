React = require 'react'

# This thing is only temporary until we get the real workflow UI figured out.

TAB = 9

TAB_PLACEHOLDER = '\t{{TAB}}\t'

module.exports = React.createClass
  displayName: 'JSONEditor'

  getDefaultProps: ->
    tabChars: '  '

  render: ->
    style =
      fontFamily: 'monospace'

    valid = try JSON.parse @props.value
    unless valid
      style.outline = '2px dashed red'

    <textarea {...@props} className="json-editor" style={style} onKeyDown={@handleKeyDown}/>

  handleKeyDown: (e) ->
    if e.which is TAB and not e.altKey # Alt-tab will focus the next input as normal.
      e.preventDefault()

      lines = e.target.value.split '\n'

      start = e.target.selectionStart;
      end = e.target.selectionEnd;

      startLine = e.target.value[0...start].split(/\n/).length - 1
      endLine = e.target.value[0...end].split(/\n/).length - 1

      console.log {start}, {end}, {startLine}, {endLine}

      if start is end # No selection
        if e.shiftKey
          # Dedent current line
          e.target.value = @dedent lines, [startLine]
          e.target.selectionStart = start - @props.tabChars.length
          e.target.selectionEnd = start - @props.tabChars.length
        else
          # Insert a tab
          e.target.value = @replaceSelectionWithTab e.target.value, start, end
          e.target.selectionStart = start + @props.tabChars.length
          e.target.selectionEnd = start + @props.tabChars.length

      else
        if startLine is endLine # Selection within one line
          if e.shiftKey
            # Dedent current line
            e.target.value = @dedent lines, [startLine]
            e.target.selectionStart = start - @props.tabChars.length
            e.target.selectionEnd = start - @props.tabChars.length
          else
            # Replace selection with a tab
            e.target.value = @replaceSelectionWithTab e.target.value, start, end
            e.target.selectionStart = start + @props.tabChars.length
            e.target.selectionEnd = start + @props.tabChars.length
        else
          # Selection across lines
          if e.target.value.charAt(end - 1) is '\n'
            # Technically it's a different line, but nothing is selected.
            endLine -= 1

          linesInSelection = [startLine..endLine]

          # TODO: Repositioning the selection here is very sloppy.

          if e.shiftKey
            e.target.value = @dedent lines, linesInSelection
            if e.target.value.charAt(start - @props.tabChars.length) is '\n'
              e.target.selectionStart = start
            else
              e.target.selectionStart = start - @props.tabChars.length
            e.target.selectionEnd = end - (@props.tabChars.length * linesInSelection.length)
          else
            e.target.value = @indent lines, linesInSelection
            e.target.selectionStart = start + @props.tabChars.length
            e.target.selectionEnd = end + (@props.tabChars.length * linesInSelection.length)

  replaceSelectionWithTab: (string, start, end) ->
    "#{string[...start]}#{@props.tabChars}#{string[end...]}"

  dedent: (lines, toDedent) ->
    for i in toDedent
      if lines[i].indexOf(@props.tabChars) is 0
        lines[i] = lines[i].replace @props.tabChars, ''
    lines.join '\n'

  indent: (lines, toIndent) ->
    for i in toIndent
      lines[i] = @props.tabChars + lines[i]
    lines.join '\n'
