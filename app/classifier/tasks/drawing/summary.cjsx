React = require 'react'
{Markdown} = (require 'markdownz').default

module.exports = React.createClass
  displayName: 'DrawingSummary'

  getDefaultProps: ->
    task: null
    annotation: null
    expanded: false

  getCorrectSingularOrPluralOfDrawingType: (type, number) ->
    if number!=1 then "#{type}s" else type

  stripMarkdownFromLabel: (label) ->
    label.replace /\!\[[^\]]*\]\([^)]*\)/g, ""

  getInitialState: ->
    expanded: @props.expanded

  render: ->
    <div>
      <div className="question">
        <Markdown>
          {@props.task.instruction}
        </Markdown>
        {if @state.expanded and @props.annotation.value.length isnt 0
          <button type="button" className="toggle-more" onClick={@setState.bind this, expanded: false, null}>Less</button>
        else if @props.annotation.value.length isnt 0
          <button type="button" className="toggle-more" onClick={@setState.bind this, expanded: true, null}>More</button>}
        {if @props.onToggle?
          if @props.inactive
            <button type="button"><i className="fa fa-eye fa-fw"></i></button>
          else
            <button type="button"><i className="fa fa-eye-slash fa-fw"></i></button>}
      </div>

      {for tool, i in @props.task.tools
        tool._key ?= Math.random()
        toolMarks = (mark for mark in @props.annotation.value when mark.tool is i)
        if @state.expanded or toolMarks.length isnt 0
          <div key={tool._key} className="answer">
            <strong>{@stripMarkdownFromLabel(tool.label)}</strong> ({[].concat toolMarks.length} {@getCorrectSingularOrPluralOfDrawingType(tool.type,toolMarks.length)} marked)
            {if @state.expanded
              for mark, i in toolMarks
                mark._key ?= Math.random()
                <div key={mark._key}>
                  {i + 1}){' '}
                  {for key, value of mark when key not in ['tool', 'sources'] and key.charAt(0) isnt '_'
                    <code key={key}><strong>{key}</strong>: {JSON.stringify value}&emsp;</code>}
                </div>}
          </div>
        else
          <div key={tool._key} className="answer">
            <strong>{@stripMarkdownFromLabel(tool.label)}</strong> ({[].concat toolMarks.length} {@getCorrectSingularOrPluralOfDrawingType(tool.type,toolMarks.length)} marked)
          </div>}
    </div>
