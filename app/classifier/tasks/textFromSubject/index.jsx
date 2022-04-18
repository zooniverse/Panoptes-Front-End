import TextFromSubjectTaskEditor from './editor';

const TextFromSubjectTask = {};

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

export default TextFromSubjectTask;
