import PropTypes from 'prop-types';
import React from 'react';
import GenericTaskEditor from '../generic-editor';
import GenericTask from '../generic';
import LabelEditor from './label-editor';
import LabelRenderer from './label-renderer';
import HighlighterSummary from './summary';
import TextRenderer from '../../annotation-renderer/text';
import HighlighterButton from './components/HighlighterButton';

export default class Highlighter extends React.Component {
  static getOffset(selection) {
    const { anchorNode } = selection;
    const { parentNode } = anchorNode;
    let start = 0;
    const nodeArray = parentNode.childNodes;
    for (let i = 0; i < nodeArray.length; i += 1) {
      const node = nodeArray[i];
      if (node.nodeType !== 8 && node !== anchorNode) {
        const text = node.getAttribute ? node.getAttribute('data-selection') : node.textContent;
        start += text.length;
      }
      if (node === anchorNode) {
        break;
      }
    }
    return start;
  }
  static selectableArea(selection, range, offset, start, end) {
    const spansNodes = range.startContainer !== range.endContainer;
    const noAreaSelected = start === end;
    const subjectSelection = selection.anchorNode.parentNode.parentNode.className === 'label-renderer';
    const isSelectable = !spansNodes && !noAreaSelected && subjectSelection;
    return isSelectable;
  }
  // in Edge and IE, when highlighting a word at the end of a line
  // sometimes an extra character is added to the range.endOffset value
  static extraNewLineCharacter(range) {
    const content = range.startContainer.textContent;
    const selectedText = range.toString();
    let { endOffset } = range;
    if (content[range.endOffset - 1] !== selectedText[-1] && content[range.endOffset - 1] === '\n') {
      endOffset = range.endOffset - 1;
    }
    return endOffset;
  }
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.createButtons = this.createButtons.bind(this);
    this.createLabelAnnotation = this.createLabelAnnotation.bind(this);
  }
  createLabelAnnotation(selection, toolIndex) {
    // currently we only deal with one selection at a time
    const range = selection.getRangeAt(0);
    const offset = this.constructor.getOffset(selection);
    const start = offset + range.startOffset;
    const endOffset = this.constructor.extraNewLineCharacter(range);
    const end = offset + endOffset;
    const task = this.props.workflow.tasks[this.props.annotation.task];
    const labelInformation = task.highlighterLabels[toolIndex];
    const selectable = this.constructor.selectableArea(selection, range, offset, start, end);
    if (selectable) {
      const newAnnotation = Object.assign({}, this.props.annotation, { _toolIndex: toolIndex });
      newAnnotation.value.push({
        labelInformation,
        start,
        end,
        text: range.toString()
      });
      this.props.onChange(newAnnotation);
    }
    selection.collapseToEnd();
  }
  handleChange(toolIndex) {
    const selection = document.getSelection();
    this.createLabelAnnotation(selection, toolIndex);
  }

  createButtons(option, index) {
    return (
      <HighlighterButton
        autoFocus={index === 0}
        color={option.color}
        key={index}
        label={option.label}
        value={option.label}
        onClick={this.handleChange.bind(this.props.annotation._toolIndex, index)}
      />
    );
  }
  render() {
    if (this.props.task.highlighterLabels !== null) {
      const labels = this.props.task.highlighterLabels.map(this.createButtons);
      return (
        <div>
          <GenericTask
            question={this.props.translation.instruction}
            help={this.props.translation.help}
            answers={labels}
            required={this.props.task.required}
            showRequiredNotice={this.props.showRequiredNotice}
          />
        </div>
      );
    } else {
      return (
        <div>{'No labels for the Highlighter Tool'}</div>
      );
    }
  }

}

Highlighter.Editor = GenericTaskEditor;

Highlighter.InsideSubject = LabelEditor;

Highlighter.PersistInsideSubject = LabelRenderer;

Highlighter.Summary = HighlighterSummary;

Highlighter.AnnotationRenderer = TextRenderer;

Highlighter.getDefaultTask = () => ({
  help: '',
  highlighterLabels: [],
  instruction: 'Highlight the text',
  type: 'highlighter'
});

Highlighter.getTaskText = task => task.instruction;

Highlighter.getDefaultAnnotation = () => ({ _toolIndex: 0, value: [] });

Highlighter.defaultProps = {
  onChange: () => null,
  showRequiredNotice: false,
  task: {
    help: '',
    highlighterLabels: [],
    type: 'highlighter',
    instruction: 'Highlight the text'
  },
  workflow: {
    tasks: []
  }
};

Highlighter.propTypes = {
  annotation: PropTypes.shape({
    _toolIndex: PropTypes.number,
    task: PropTypes.string
  }),
  onChange: PropTypes.func,
  showRequiredNotice: PropTypes.bool,
  task: PropTypes.shape({
    help: PropTypes.string,
    highlighterLabels: PropTypes.array,
    instruction: PropTypes.string,
    required: PropTypes.bool,
    tools: PropTypes.array,
    type: PropTypes.string
  }),
  workflow: PropTypes.shape({
    tasks: PropTypes.object
  })
};

Highlighter.defaultProps = {
  annotation: {
    value: []
  },
  task: {
    help: '',
    highlighterLabels: [],
    instruction: 'Highlight the text',
    type: 'highlighter'
  }
}
