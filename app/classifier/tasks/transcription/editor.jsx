import React from 'react';
import { MarkdownEditor, MarkdownHelp } from 'markdownz';
import handleInputChange from '../../../lib/handle-input-change';
import AutoSave from '../../../components/auto-save';
import alert from  '../../../lib/alert';
import SubTaskEditor from './SubtaskEditor';

export default function TranscriptionTaskEditor({ task, taskPrefix, workflow }) {
  const handleChange = handleInputChange.bind(workflow)

  // function handleSubtaskChange (subtaskIndex, path, value) {
  //   taskKey = (key for key, description of @props.workflow.tasks when description is @props.task)[0]
  //   changes = {}
  //   changes["#{@props.toolPath}.details.#{subtaskIndex}.#{path}"] = value
  //   @props.workflow.update(changes).save()
  // }

  const toolPath = `${taskPrefix}.tools.0`
  const subtask = task.tools[0].details[0]

  return (
    <div className={`workflow-task-editor ${task.type}`}>
      <p className='form-help'>The transcription task comprises of a pre-configured drawing task using a two-click line drawing mark, the transcription line tool, and text sub-task.</p>
      <p className='form-help'>Only the instructions, help text, and text modifiers are editable.</p>
      <div>
        <AutoSave resource={workflow}>
          <span className="form-label">Main text</span>
          <br />
          <textarea name={`${taskPrefix}.instruction`} value={task.instruction} className="standard-input full" onChange={handleChange} />
        </AutoSave>
        <small className="form-help">Describe the task, or ask the question, in a way that is clear to a non-expert. You can use markdown to format this text.</small><br />
      </div>
      <br />
      <div>
        <AutoSave resource={workflow}>
          <span className="form-label">Help text</span>
          <br />
          <MarkdownEditor name={`${taskPrefix}.help`} onHelp={() => {alert(<MarkdownHelp/>)}} value={task.help ?? ""} rows="7" className="full" onChange={handleChange} />
        </AutoSave>
        <small className="form-help">Add text and images for a window that pops up when volunteers click “Need some help?” You can use markdown to format this text and add images. The help text can be as long as you need, but you should try to keep it simple and avoid jargon.</small>
      </div>
      <hr />
      <div className="drawing-task-details-editor">
        <p className='form-label'>Text sub-task</p>
        <SubTaskEditor
          subtask={subtask}
          subtaskPrefix={`${toolPath}.details.0`}
          workflow={workflow}
        />
      </div>
      <hr />
      <div>
        <p className='form-label'>Transcription line tool</p>
        <small className="form-help">
          This is a 2-click line mark tool which has pre-set colors. These colors map to the following states:
          <dl>
            <dt><img src='https://via.placeholder.com/10x10.png/06FE76?text=+' /> Green</dt>
            <dd>A transcription line mark currently selected by the volunteer.</dd>
            <dt><img src='https://via.placeholder.com/10x10.png/235DFF?text=+' /> Blue</dt>
            <dd>A transcription line mark made by the volunteer.</dd>
            <dt><img src='https://via.placeholder.com/10x10.png/FF40FF?text=+' /> Purple </dt>
            <dd>A transcription line mark made previously by another volunteer. This mark can be selected to create a new transcription to submit.</dd>
            <dt><img src='https://via.placeholder.com/10x10.png/979797?text=+' /> Gray</dt>
            <dd>A transcription line mark which has reached consensus. The mark and transcriptions are view only.</dd>
          </dl>
        </small>
      </div>
    </div>
  )
}