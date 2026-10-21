import React from 'react';
import { MarkdownEditor, MarkdownHelp } from 'markdownz';
import AutoSave from '../../../components/auto-save.coffee';
import handleInputChange from '../../../lib/handle-input-change.js';
import alert from '../../../lib/alert';

export default function ExternalWorkflowEditor({ workflow = null }) {
  const handleChange = handleInputChange.bind(workflow);
  const {
    external_workflow_url: url = '',
    external_workflow_description: description = ''
  } = workflow.configuration ?? {};
  const insecureUrl = url.trim() !== '' && !url.startsWith('https://');

  return (
    <div className="workflow-external-workflow-editor">
      <span className="form-label">External workflow</span>
      <br />
      <small className="form-help">
        Point this workflow at a custom front end hosted outside Zooniverse. When a URL is set, the classify page shows your description and a button to the external site instead of the classifier.
      </small>
      <AutoSave resource={workflow}>
        <div className="workflow-external-workflow-field" data-field="url">
          <label>
            External workflow URL
            <br />
            <input
              type="url"
              className="standard-input full"
              placeholder="https://example.org/my-workflow"
              name="configuration.external_workflow_url"
              value={url}
              onChange={handleChange}
            />
          </label>
          {insecureUrl && (
            <small className="workflow-external-workflow-error" data-field="url" role="alert">
              External workflow URLs should start with <code>https://</code>.
            </small>
          )}
        </div>
        <div className="workflow-external-workflow-field" data-field="description">
          <label>
            Departure screen description
            <br />
            <MarkdownEditor
              className="full"
              name="configuration.external_workflow_description"
              rows="6"
              value={description}
              onChange={handleChange}
              onHelp={() => alert(<MarkdownHelp />)}
            />
          </label>
          <small className="form-help">Shown to volunteers before they leave for the external site. Markdown is supported.</small>
        </div>
      </AutoSave>
    </div>
  );
}
