import React from 'react';

import TextFromSubjectTaskEditor from './editor';

// The TextFromSubject task is an experimental FEM task.
// The TextFromSubject task is a text task that initializes the annotation value from a text subject's content.

export default function TextFromSubjectTask() {
  return (
    <div>
      <p>
        The TextFromSubject task is designed exclusively for the front-end-monorepo.
        It is not intended to be used in Panoptes-Front-End.
      </p>
    </div>
  );
}

// Define the static methods and values

TextFromSubjectTask.Editor = TextFromSubjectTaskEditor;
TextFromSubjectTask.getDefaultAnnotation = () => ({
  value: ''
});
TextFromSubjectTask.getDefaultTask = () => ({
  help: '',
  instruction: 'Correct the text',
  type: 'textFromSubject'
});
TextFromSubjectTask.getTaskText = task => (task.instruction);
// isAnnotationComplete will return false within PFE to prevent classifications from being submitted within PFE, as the TextFromSubject task is exclusively for the front-end-monorepo.
TextFromSubjectTask.isAnnotationComplete = () => false;
