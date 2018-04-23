import { Markdown } from 'markdownz';
import PropTypes from 'prop-types';
import React from 'react';
import alert from '../../lib/alert';
import TaskHelpButton from './components/TaskHelpButton';

export default class GenericTask extends React.Component {
  constructor(props) {
    super(props);
    this.container = null;
    this.showHelp = this.showHelp.bind(this);
    this.state = {
      helping: false
    };
  }

  componentDidMount() {
    if (this.props.autoFocus && this.container.focus) {
      this.container.focus();
    }
  }

  componentDidUpdate(prevProps) {
    // autofocus the container again if the question changes
    if (this.props.autoFocus && this.props.question !== prevProps.question && this.container.focus) {
      this.container.focus();
    }
  }

  showHelp() {
    alert(
      (resolve, reject) =>
        (
          <div className="content-container">
            <Markdown className="classification-task-help">
              {this.props.help}
            </Markdown>
            <button className="standard-button" onClick={reject}>Close</button>
          </div>
        )
    );
  }

  render() {
    let required;
    if (this.props.required && this.props.showRequiredNotice) {
      required = (
        <div className="required-task-warning">
          <p>
            <small>
              <strong>This step is required.</strong>
              <br />
              If you’re not allowed to continue, make sure it’s complete.
            </small>
          </p>
        </div>
      );
    }
    return (
      <div className="workflow-task" tabIndex={-1} ref={(element) => { this.container = element; }}>
        <Markdown className="question">{this.props.question}</Markdown>
        {this.props.children}
        <div className="answers">
          {React.Children.map(
            this.props.answers,
            answer => React.cloneElement(answer, { className: `answer ${answer.props.className}` })
          )}
        </div>
        {required}
        {this.props.help &&
          <TaskHelpButton onClick={this.showHelp} />}
      </div>
    );
  }
}

GenericTask.propTypes = {
  autoFocus: PropTypes.bool,
  children: PropTypes.node,
  question: PropTypes.string,
  help: PropTypes.string,
  required: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.bool
  ]),
  answers: PropTypes.arrayOf(PropTypes.node),
  showRequiredNotice: PropTypes.bool
};

GenericTask.defaultProps = {
  autoFocus: false,
  children: null,
  question: '',
  help: '',
  required: false,
  answers: [],
  showRequiredNotice: false
};