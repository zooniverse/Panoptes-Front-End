import PropTypes from 'prop-types';
import React from 'react';
import _ from 'lodash';

import GenericTask from '../generic';
import TextTaskEditor from './editor';
import TextTaskSummary from './summary';

const LINEHEIGHT = 22.5;
const NOOP = Function.prototype;

export default class TextTask extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      rows: 1,
      value: ''
    };

    this.textInput = React.createRef();

    this.debouncedUpdateAnnotation = _.debounce(this.updateAnnotation, 500).bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.setTagSelection = this.setTagSelection.bind(this);
    this.updateAnnotation = this.updateAnnotation.bind(this);
  }

  componentWillMount() {
    this.setState({
      value: this.props.annotation.value
    });
  }

  componentDidMount() {
    this.handleResize();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.task !== this.props.task) {
      this.setState({
        rows: 1,
        value: nextProps.annotation.value
      });
    }
    if (nextProps.annotation.value !== this.props.annotation.value) {
      this.setState({
        value: nextProps.annotation.value
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.task !== this.props.task) {
      this.handleResize();
      if (this.props.autoFocus === true) {
        this.textInput.current.focus();
      }
    }

    if (prevState.value && this.state.value && (prevState.value > this.state.value)) {
      this.setInitialRows();
    }

    this.handleResize();
  }

  componentWillUnmount() {
    this.updateAnnotation();
  }

  setInitialRows() {
    this.setState({ rows: 1 });
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
    this.setState({ value });
    this.debouncedUpdateAnnotation();
  }

  handleResize() {
    const oldRows = this.textInput.current.rows;
    const newRows = Math.floor(this.textInput.current.scrollHeight / LINEHEIGHT);

    if (newRows && (newRows !== oldRows)) {
      this.setState({ rows: newRows });
    }
  }

  handleChange() {
    this.handleResize();
    const value = this.textInput.current.value;
    this.setState({ value });
    this.debouncedUpdateAnnotation();
  }

  updateAnnotation() {
    const value = this.textInput.current.value;
    const newAnnotation = Object.assign(this.props.annotation, { value });
    this.props.onChange(newAnnotation);
  }

  render() {
    return (
      <GenericTask
        question={this.props.task.instruction}
        help={this.props.task.help}
        required={this.props.task.required}
      >
        <label className="answer" htmlFor="textInput">
          <textarea
            autoFocus={this.props.autoFocus}
            className="standard-input full"
            id="textInput"
            ref={this.textInput}
            value={this.state.value}
            onChange={this.handleChange}
            rows={this.state.rows}
            style={{ lineHeight: `${LINEHEIGHT}px` }}
          />
        </label>
        {this.props.task.text_tags && this.props.task.text_tags.length &&
          <div className="transcription-metadata-tags">
            {this.props.task.text_tags.map((tag, i) => (
              <input
                type="button"
                className="standard-button text-tag"
                key={i}
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
  onChange: NOOP,
  task: {
    help: '',
    instruction: '',
    required: false
  }
};
