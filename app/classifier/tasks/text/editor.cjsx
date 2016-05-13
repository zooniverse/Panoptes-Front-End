React = require 'react'
alert = require '../../../lib/alert'
AutoSave = require '../../../components/auto-save'
handleInputChange = require '../../../lib/handle-input-change'
{MarkdownEditor} = require 'markdownz'
MarkdownHelp = require '../../../partials/markdown-help'



module?.exports = React.createClass
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
    if @props.task.text_tags
      # the tag does not current exist and the input is checked
      if @props.task.text_tags.indexOf(value) is -1 and checked
        @props.task.text_tags.push(value)
        @props.onChange @props.task
      else if !checked
        removalIndex = @props.task.text_tags.indexOf(value)
        @props.task.text_tags.splice(removalIndex,1);
        @props.onChange @props.task
    else 
      @props.task.text_tags = []
      @props.task.text_tags.push(value) if checked
      @props.onChange @props.task


  render: ->
    handleChange = handleInputChange.bind @props.workflow


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
        <div>
          <AutoSave resource={@props.workflow}>
            <span className="form-label">Help text</span>
            <br />
            <MarkdownEditor name="#{@props.taskPrefix}.help" value={@props.task.help ? ""} rows="4" className="full" onChange={handleChange} onHelp={-> alert <MarkdownHelp/>} />
          </AutoSave>
          <small className="form-help">Add text and images for a help window.</small>
        </div>
        <hr/>
      </section>
      <section>
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
    </div>