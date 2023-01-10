import React from 'react';
import TranscriptionTaskEditor from './editor';

class TranscriptionTask extends React.PureComponent {
  render() {
    return null;
  }
}

TranscriptionTask.Editor = TranscriptionTaskEditor;
TranscriptionTask.getTaskText = task => task.instruction;

export default TranscriptionTask;
