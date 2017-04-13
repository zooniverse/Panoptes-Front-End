import React from 'react';
import GenericTaskEditor from '../generic-editor';
import GenericTask from '../generic';
import {Markdown} from 'markdownz';

export default class Highlighter extends React.Component {
  constructor(props) {
    super(props);
  }

  render(){
    return(
      <div className="highlighter-tool" />
    );
  }
}

Highlighter.Editor = GenericTaskEditor;

Highlighter.getDefaultTask = () => {
  return(
    {
      type: 'highlighter',
      instruction: 'Highlight the text',
      help: '',
      highlighterLabels: []
    }
  );
};

Highlighter.getTaskText = (task) => {
  return(task.instruction);
};

Highlighter.getDefaultAnnotation = () => {
  return({
    _toolIndex: 0,
    value: []
  });
}

Highlighter.defaultProps = {
  task: {
    type: 'highlighter',
    instruction: 'Highlight the text',
    help: '',
    highlighterLabels: []
  }
};

Highlighter.propTypes = {
  task: React.PropTypes.shape({
    type: React.PropTypes.string,
    instruction: React.PropTypes.string,
    help: React.PropTypes.string,
    tools: React.PropTypes.array
  })
};