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
  configuration: {

  }
};

const defaultProject = {
  id: '123213',
  launch_approved: true,
}

const createTask = (changes) => {
  return Object.assign({}, defaultTask, changes);
};

const createWorkflow = (changes) => {
  return Object.assign({}, defaultWorkflow, changes);
};

const longQuestion = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ut dui erat. Vivamus est nisl, accumsan non urna at, elementum tempor urna. Sed eget pulvinar eros. Nunc placerat metus bibendum lacus elementum, vitae sagittis mi tincidunt.';

const threeAnswers = [
  { label: 'Yes' },
  { label: 'No' },
  { label: 'Maybe' }
]

export {
  createTask,
  createWorkflow,
  defaultTask,
  defaultWorkflow,
  defaultProject,
  longQuestion,
  threeAnswers,
}
