React = require 'react'
createReactClass = require 'create-react-class'
alert = require('../../../lib/alert').default
AutoSave = require '../../../components/auto-save'
handleInputChange = require('../../../lib/handle-input-change').default
{MarkdownEditor, MarkdownHelp} = require 'markdownz'
NextTaskSelector = require '../next-task-selector'

module.exports = createReactClass
  displayName: 'TextTaskEditor'

  getDefaultProps: ->
    workflow: {}
    task: {}

  tagExists:(tag) ->
    if @props.task.text_tags
      @props.task.text_tags.indexOf(tag) > -1

  updateTags:(e)->
    value = e.target.value
    checked = e.target.checked
    text_tags = @props.task.text_tags ? []
    if text_tags.indexOf(value) is -1 and checked
      text_tags.push(value)
    else if !checked
      removalIndex = text_tags.indexOf(value)
      text_tags.splice(removalIndex,1);
    @props.task.text_tags = text_tags
    @props.onChange @props.task


  render: ->
    handleChange = handleInputChange.bind @props.workflow
    requiredHelp = 'Check this box if this question has to be answered before proceeding. If a marking task is Required, the volunteer will not be able to move on until they have made at least 1 mark.'

    <div className="text-editor" >
      <section>
        <div>
          <AutoSave resource={@props.workflow}>
            <span className="form-label">Main text</span>
            <br />
            <textarea name="#{@props.taskPrefix}.instruction" value={@props.task.instruction} className="standard-input full" onChange={handleChange} />
          </AutoSave>
          <small className="form-help">Describe the task, or ask the question, in a way that is clear to a non-expert. You can use markdown to format this text.</small><br />
        </div>
        <br/>
        {unless @props.isSubtask
          <div>
            <AutoSave resource={@props.workflow}>
              <span className="form-label">Help text</span>
              <br />
              <MarkdownEditor name="#{@props.taskPrefix}.help" value={@props.task.help ? ""} rows="4" className="full" onChange={handleChange} onHelp={-> alert <MarkdownHelp/>} />
            </AutoSave>
            <small className="form-help">Add text and images for a help window.</small>
          </div>}
        <span>
          <label className="pill-button" title={requiredHelp}>
            <AutoSave resource={@props.workflow}>
              <input type="checkbox" name="#{@props.taskPrefix}.required" checked={@props.task.required} onChange={handleChange} />{' '}
              Required
            </AutoSave>
          </label>
          {' '}
        </span>
        <br />
        <span className="form-label">Metadata Tags</span> <br/>
          <small className="form-help">Volunteers can attach the following tags to highlighted portions of their transcription.</small><br/>
            <label>
              <input type="checkbox" value="deletion" checked={@tagExists('deletion')} onChange={@updateTags} />
              {"Deletion"}
            </label>
            <br/>
            <label>
              <input type="checkbox" value="insertion" checked={@tagExists('insertion')} onChange={@updateTags} />
              {"Insertion"}
            </label>
            <br/>
            <label>
              <input type="checkbox" value="unclear" checked={@tagExists('unclear')} onChange={@updateTags} />
              {"Unclear"}
            </label>
      </section>
      <hr/>
      {unless @props.isSubtask
        <AutoSave resource={@props.workflow}>
          <span className="form-label">Next task</span>
          <br />
          <NextTaskSelector workflow={@props.workflow} name="#{@props.taskPrefix}.next" value={@props.task.next ? ''} onChange={handleInputChange.bind @props.workflow} />
        </AutoSave>}
    </div>
