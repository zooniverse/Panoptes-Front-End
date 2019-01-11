import PropTypes from 'prop-types';
import React from 'react';
import _ from 'lodash';

import GenericTask from '../generic';
import TextTaskEditor from './editor';
import TextTaskSummary from './summary';

const LINEHEIGHT = 22.5;
const NOOP = Function.prototype;

export default class TextTask extends React.PureComponent {
  constructor(props) {
    super(props);

    this.textInput = React.createRef();

    this.debouncedUpdateAnnotation = _.debounce(this.updateAnnotation, 500);
    this.handleChange = this.handleChange.bind(this);
    this.setTagSelection = this.setTagSelection.bind(this);
  }

  state = {
    rows: 1,
    value: this.props.annotation.value
  }

  componentDidMount() {
    this.handleMount = setTimeout(() => {
      if (this.props.autoFocus) {
        this.textInput.current.focus();
      }
      this.handleResize();
    });
  }

  componentDidUpdate() {
    this.handleResize();
  }

  componentWillUnmount() {
    this.debouncedUpdateAnnotation.flush();
    clearTimeout(this.handleMount);
  }

  setTagSelection(e) {
    const textTag = e.target.value;
    const startTag = `[${textTag}]`;
    const endTag = `[/${textTag}]`;
    const textArea = this.textInput.current;
    const textAreaValue = textArea.value;
    const selectionStart = textArea.selectionStart;
    const selectionEnd = textArea.selectionEnd;
    const textBefore = textAreaValue.substring(0, selectionStart);
    let textAfter;
    let value;

    if (selectionStart === selectionEnd) {
      textAfter = textAreaValue.substring(selectionStart, textAreaValue.length);
      value = textBefore + startTag + endTag + textAfter;
    } else {
      const textInBetween = textAreaValue.substring(selectionStart, selectionEnd);
      textAfter = textAreaValue.substring(selectionEnd, textAreaValue.length);
      value = textBefore + startTag + textInBetween + endTag + textAfter;
    }

    this.setState({ value }, () => {
      if (this.textInput.current.focus) {
        this.textInput.current.setSelectionRange((value.length - textAfter.length), (value.length - textAfter.length));
        this.textInput.current.focus();
      }
    });

    this.updateAnnotation(value);
  }

  handleChange() {
    const value = this.textInput.current.value;
    if (value.length < this.state.value.length) {
      this.setState({ rows: 1, value });
    } else {
      this.setState({ value });
    }

    this.debouncedUpdateAnnotation(value);
  }

  handleResize() {
    const oldRows = this.state.rows;
    let newRows = this.textInput.current ? Math.floor(this.textInput.current.scrollHeight / LINEHEIGHT) : oldRows;
    newRows = Math.max(newRows, 1);

    if (newRows !== oldRows) {
      this.setState({ rows: newRows });
    }
  }

  updateAnnotation(value) {
    const newAnnotation = Object.assign(this.props.annotation, { value });
    this.props.onChange(newAnnotation);
  }

  render() {
    return (
      <GenericTask
        question={this.props.translation.instruction}
        help={this.props.translation.help}
        required={this.props.task.required}
      >
        <label className="answer" htmlFor="textInput">
          <textarea
            className="standard-input full"
            onBlur={this.debouncedUpdateAnnotation.flush}
            onChange={this.handleChange}
            ref={this.textInput}
            rows={this.state.rows}
            style={{ lineHeight: `${LINEHEIGHT}px`, overflow: 'hidden' }}
            value={this.state.value}
          />
        </label>
        {this.props.task.text_tags && this.props.task.text_tags.length > 0 &&
          <div className="transcription-metadata-tags">
            {this.props.task.text_tags.map(tag => (
              <input
                type="button"
                className="standard-button text-tag"
                key={tag}
                value={tag}
                onClick={this.setTagSelection}
              />
            ))}
          </div>}
      </GenericTask>);
  }
}

// Define the static methods and values

TextTask.Editor = TextTaskEditor;
TextTask.Summary = TextTaskSummary;
TextTask.getDefaultTask = () => ({
  help: '',
  instruction: 'Enter an instruction.',
  required: false,
  type: 'text'
});
TextTask.getTaskText = task => task.instruction;
TextTask.getDefaultAnnotation = () => ({ value: '' });
TextTask.isAnnotationComplete = (task, annotation) => {
  if (annotation.value !== '' || !task.required) {
    return true;
  } else {
    return false;
  }
};

TextTask.propTypes = {
  annotation: PropTypes.shape({
    value: PropTypes.string
  }),
  autoFocus: PropTypes.bool,
  onChange: PropTypes.func,
  task: PropTypes.shape({
    help: PropTypes.string,
    instruction: PropTypes.string,
    required: PropTypes.bool,
    text_tags: PropTypes.arrayOf(
      PropTypes.string
    )
  })
};

TextTask.defaultProps = {
  annotation: {
    value: ''
  },
  autoFocus: false,
  onChange: NOOP,
  task: {
    help: '',
    instruction: '',
    required: false
  }
};
