import React from 'react';
import assert from 'assert';
import { mount } from 'enzyme';
import { TaskTranslations } from './translations';

function StubTask() {
  return (
    <p> I do nothing.</p>
  );
}

const initialTranslations = {
  strings: {
    workflow: {}
  }
};

const translations = {
  strings: {
    workflow: {
      '1': {
        translated_type: 'Workflow',
        translated_id: '1',
        strings: {
          display_name: 'A test workflow',
          tasks: {
            survey: {
              choices: {
                ar: {
                  label: 'Translated Armadillo'
                }
              },
              questions: {
                ho: {
                  answers: {
                    one: {
                      label: 'Translated 1'
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
};

const task = {
  choices: {
    ar: {
      label: 'Armadillo'
    },
    to: {
      label: 'Tortoise'
    }
  },
  questions: {
    ho: {
      answers: {
        one: {
          label: '1'
        },
        two: {
          label: '2'
        }
      }
    }
  }
};

const expectedTask = {
  choices: {
    ar: {
      label: 'Armadillo'
    },
    to: {
      label: 'Tortoise'
    }
  },
  questions: {
    ho: {
      answers: {
        one: {
          label: '1'
        },
        two: {
          label: '2'
        }
      }
    }
  }
};

const expectedTranslation = {
  choices: {
    ar: {
      label: 'Translated Armadillo'
    },
    to: {
      label: 'Tortoise'
    }
  },
  questions: {
    ho: {
      answers: {
        one: {
          label: 'Translated 1'
        },
        two: {
          label: '2'
        }
      }
    }
  }
};

describe('Task translation with a translation', function () {
  const wrapper = mount(
    <TaskTranslations taskKey="survey" task={task} translations={translations} workflowID="1">
      <StubTask task={task} />
    </TaskTranslations>
  );
  const stubTask = wrapper.find(StubTask);

  it('should not mutate the original task', function () {
    assert.deepEqual(stubTask.prop('task'), expectedTask);
  });

  it('should copy translation strings to the translation object', function () {
    assert.deepEqual(stubTask.prop('translation'), expectedTranslation);
  });
});

describe('Task translation without a translation', function () {
  const wrapper = mount(
    <TaskTranslations taskKey="survey" task={task} translations={initialTranslations} workflowID="1">
      <StubTask task={task} />
    </TaskTranslations>
  );
  const stubTask = wrapper.find(StubTask);

  it('should not mutate the original task', function () {
    assert.deepEqual(stubTask.prop('task'), expectedTask);
  });

  it('should fall back to using the workflow task strings', function () {
    assert.deepEqual(stubTask.prop('translation'), expectedTask);
  });
});
