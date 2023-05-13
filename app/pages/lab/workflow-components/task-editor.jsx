import ShortcutEditor from '../../../classifier/tasks/shortcut/editor.jsx';
import FeedbackSection from '../../../features/feedback/lab';
import MobileSection from '../mobile/index.js';
import AutoSave from '../../../components/auto-save.coffee';
import taskComponents from '../../../classifier/tasks/index.js';

export default function TaskEditor({ pfeLab = false, onDelete, project, selectedTaskKey, workflow }) {
  const task = workflow.tasks[selectedTaskKey];

  function onChange(taskDescription) {
    const changes = {
      [`tasks.${selectedTaskKey}`]: taskDescription
    };
    return workflow.update(changes).save();
  }

  function handleTaskDelete(event) {
    onDelete(selectedTaskKey, event);
  }

  if (!!selectedTaskKey && !!task) {
    if (task.required === 'true') {
      task.required = true;
    }
    if (task.required === 'false') {
      task.required = false;
    }
    const TaskEditorComponent = taskComponents[task.type]?.Editor;
    const taskWithDefaults = {
      required: false,
      ...task
    };

    return <div>
      {(project.experimental_tools?.includes('shortcut') && pfeLab) ?
        <ShortcutEditor workflow={workflow} task={taskWithDefaults}>
          <TaskEditorComponent
            workflow={workflow}
            task={taskWithDefaults}
            taskPrefix={`tasks.${selectedTaskKey}`}
            project={project}
            onChange={onChange}
          />
        </ShortcutEditor>
      : TaskEditorComponent ?
        <TaskEditorComponent
          workflow={workflow}
          task={taskWithDefaults}
          taskPrefix={`tasks.${selectedTaskKey}`}
          project={project}
          onChange={onChange}
          pfeLab={pfeLab}
        />
      :
        <div>Editor is not available.</div>
      }
      <hr />
      <br />

      {project.experimental_tools?.includes('general feedback') ?
        <FeedbackSection
          task={task}
          saveFn={onChange}
        /> :
          null
      }
      <hr />
      <br />

      <MobileSection
        project={project}
        workflow={workflow}
        task={task}
      />

      <AutoSave resource={workflow}>
        <button type="button" className="minor-button" onClick={handleTaskDelete}>
          <small>Delete this task</small>
        </button>
      </AutoSave>
    </div>;
  } else {
    return <div className="form-help">
      <p>Choose a task to edit. The configuration for that task will appear here.</p>
    </div>;
  }
}
