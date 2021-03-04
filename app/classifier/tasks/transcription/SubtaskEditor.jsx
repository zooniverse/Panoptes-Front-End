import React from 'react'
import AutoSave from '../../../components/auto-save';

export default function SubTaskEditor({ subtask, subtaskPrefix, workflow }) {
  const instructionPath = `${subtaskPrefix}.instruction`
  const textTagsPath = `${subtaskPrefix}.text_tags`
  function tagExists(tag) {
    if (subtask.text_tags) {
      return subtask.text_tags.indexOf(tag) > -1;
    }

    return false
  }

  function updateTags(event) {
    const changes = {};
    const { checked, value } = event.target;
    const text_tags = subtask.text_tags ?? [];
    if (text_tags.indexOf(value) === -1 && checked) {
      text_tags.push(value)
    } else if (!checked) {
      const removalIndex = text_tags.indexOf(value)
      text_tags.splice(removalIndex, 1);
    }
    changes[textTagsPath] = text_tags
    workflow.update(changes).save()
  }

  function handleChange(event) {
    const { name,  value } = event.target;
    const changes = {};
    changes[name] = value;
    // Don't need to call save here because wrapped by an AutoSave component in render
    workflow.update(changes);
  }

  return (
    <div className="text-editor">
      <section>
        <div>
          <AutoSave resource={workflow}>
            <span className="form-label">Main text</span>
            <br />
            <textarea name={instructionPath} value={subtask.instruction} className="standard-input full" onChange={handleChange} />
          </AutoSave>
          <small className="form-help">Describe the task, or ask the question, in a way that is clear to a non-expert. You can use markdown to format this text.</small><br />
        </div>
        <br />
        <span className="form-label">Metadata Tags</span> <br/>
        <small className="form-help">Volunteers can attach the following tags to highlighted portions of their transcription.</small><br/>
        <label>
          <input type="checkbox" value="deletion" checked={tagExists('deletion')} onChange={updateTags} />
          {"Deletion"}
        </label>
        <br/>
        <label>
          <input type="checkbox" value="insertion" checked={tagExists('insertion')} onChange={updateTags} />
          {"Insertion"}
        </label>
        <br/>
        <label>
          <input type="checkbox" value="unclear" checked={tagExists('unclear')} onChange={updateTags} />
          {"Unclear"}
        </label>
      </section>
    </div>
  )
}