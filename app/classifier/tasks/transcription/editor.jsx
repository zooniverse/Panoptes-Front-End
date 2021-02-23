import React from 'react';
import { MarkdownEditor, MarkdownHelp } from 'markdownz';
import handleInputChange from '../../../lib/handle-input-change';
import AutoSave from '../../../components/auto-save';
import alert from  '../../../lib/alert';

export default function TranscriptionTaskEditor({ task, taskPrefix, workflow }) {
  const handleChange = handleInputChange.bind(workflow)

  return (
    <div className={`workflow-task-editor ${task.type}`}>
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
    </div>
  )
}