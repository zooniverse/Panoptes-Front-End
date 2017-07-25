/* eslint no-underscore-dangle: ["error", { "allow": ["_toolIndex"] }] */

import React from 'react';
import { Markdown } from 'markdownz';
import GenericTaskEditor from '../generic-editor';
import GenericTask from '../generic';
import LabelEditor from './label-editor';
import LabelRenderer from './label-renderer';
import HighlighterSummary from './summary';
import TextRenderer from '../../annotation-renderer/text';

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
    const end = offset + range.endOffset;
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
      <div>
        <button
          className="minor-button answer-button"
          value={option.label}
          onClick={this.handleChange.bind(this.props.annotation._toolIndex, index)}
        >
          <i className="fa fa-i-cursor" aria-hidden="true" style={{ color: `${option.color}` }} />
          <Markdown className="answer-button-label">{option.label}</Markdown>
        </button>
      </div>
    );
  }
  render() {
    if (this.props.task.highlighterLabels !== null) {
      const labels = this.props.task.highlighterLabels.map(this.createButtons);
      return (
        <div>
          <GenericTask
            question={this.props.task.instruction}
            help={this.props.task.help}
            answers={labels}
            required={this.props.task.required}
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
  task: {
    help: '',
    highlighterLabels: [],
    type: 'highlighter',
    instruction: 'Highlight the text'
  }
};

Highlighter.propTypes = {
  annotation: React.PropTypes.shape({
    _toolIndex: React.PropTypes.number,
    task: React.PropTypes.shape({
      help: React.PropTypes.string,
      highlighterLabels: React.PropTypes.array,
      instruction: React.PropTypes.string,
      required: React.PropTypes.bool,
      tools: React.PropTypes.array,
      type: React.PropTypes.string
    }),
    tools: React.PropTypes.array
  }),
  onChange: React.PropTypes.func,
  task: React.PropTypes.shape({
    help: React.PropTypes.string,
    highlighterLabels: React.PropTypes.array,
    instruction: React.PropTypes.string,
    required: React.PropTypes.bool,
    tools: React.PropTypes.array,
    type: React.PropTypes.string
  }),
  workflow: React.PropTypes.shape({
    tasks: React.PropTypes.object
  })
};
