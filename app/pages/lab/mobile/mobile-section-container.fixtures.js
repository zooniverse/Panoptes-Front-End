const defaultTask = {
  question: 'What is it?',
  type: 'single',
  answers: [
    { label: 'Yes' },
    { label: 'No' }
  ]
}

const defaultWorkflow = {
  tasks: {
    T0: {
      answers: [
        { label: 'Yes' },
        { label: 'No' }
      ]
    }
  },
  configuration: {}
};

const defaultProject = {
  id: '123213',
  launch_approved: true,
}

const createTask = (changes) => {
  return Object.assign({}, defaultTask, changes);
};

export {
  createTask,
  defaultTask,
  defaultWorkflow,
  defaultProject,
}
