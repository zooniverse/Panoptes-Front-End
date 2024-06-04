const DEFAULT_HANDLER = () => {};

export default function ExperimentalPanel({
  update = DEFAULT_HANDLER
}) {
  function experimentalReset() {
    update({
      configuration: {},
      first_task: '',
      tasks: {},
      steps: []
    });
  }

  function experimentalQuickSetup() {
    update({
      first_task: '',
      tasks: {
        'T0': {
          answers: [
            {next: 'P1', label: 'Animals'},
            {next: 'P2', label: 'Fruits'},
            {label: 'Neither'}
          ],
          help: '',
          question: 'Do you like Animals or Fruits?',
          required: false,
          type: 'single'
        },
        'T1': { help: '', type: 'text', required: false, instruction: 'Which animal?' },
        'T2': { help: '', type: 'text', required: false, instruction: 'Which fruit?' }
      },
      steps: [
        ['P0', { stepKey: 'P0', taskKeys: ["T0"] }],
        ['P1', { next: 'P2', stepKey: 'P1', taskKeys: ["T1"] }],
        ['P2', { stepKey: 'P2', taskKeys: ["T2"] }]
      ]
    });
  }

  function experimentalQuickSetupBranching() {
    update({
      tasks: {
        'T1.1': {
          answers: [
            {next: 'P2', label: 'Go to the 🔴 RED page'},
            {next: 'P3', label: 'Go to the 🔵 BLUE page'},
          ],
          help: '',
          question: 'Oh dear, this page has multiple branching tasks. Let\'s see what happens',
          required: false,
          type: 'single'
        },
        'T1.2': {
          answers: [
            {next: 'P4', label: 'Go to the 🟡 YELLOW page'},
            {next: 'P5', label: 'Go to the 🟢 GREEN page'},
          ],
          help: '',
          question: 'This is the second branching task. If you answer both on the page, where do you branch to?',
          required: false,
          type: 'single'
        },
        'T2': { help: '', type: 'text', required: false, instruction: 'Welcome to the 🔴 RED page! How do you feel?' },
        'T3': { help: '', type: 'text', required: false, instruction: 'Welcome to the 🔵 BLUE page! How do you feel?' },
        'T4': { help: '', type: 'text', required: false, instruction: 'Welcome to the 🟡 YELLOW page! How do you feel?' },
        'T5': { help: '', type: 'text', required: false, instruction: 'Welcome to the 🟢 GREEN page! How do you feel?' },
      },
      steps: [
        ['P1', { stepKey: 'P1', taskKeys: ['T1.1', 'T1.2'] }],
        ['P2', { stepKey: 'P2', taskKeys: ['T2'] }],
        ['P3', { stepKey: 'P3', taskKeys: ['T3'] }],
        ['P4', { stepKey: 'P4', taskKeys: ['T4'] }],
        ['P5', { stepKey: 'P5', taskKeys: ['T5'] }],
      ]
    });
  }

  return (
    <div
      style={{
        padding: '16px',
        margin: '8px 0',
        border: '2px dashed #c04040'
      }}
    >
      <button
        className="big"
        onClick={experimentalReset}
        type="button"
        style={{ margin: '0 4px' }}
      >
        RESET
      </button>
      <button
        className="big"
        onClick={experimentalQuickSetup}
        type="button"
        style={{ margin: '0 4px' }}
      >
        QUICK SETUP (simple)
      </button>
      <button
        className="big"
        onClick={experimentalQuickSetupBranching}
        type="button"
        style={{ margin: '0 4px' }}
      >
        QUICK SETUP (advanced, branching)
      </button>
    </div>
  );
}