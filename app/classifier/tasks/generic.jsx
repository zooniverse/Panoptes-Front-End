import { Markdown } from 'markdownz';
import React from 'react';
import alert from '../../lib/alert';

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
    this.props.autoFocus && this.container.focus && this.container.focus();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.answers !== this.props.answers && nextProps.autoFocus && this.container.focus) {
      this.container.focus();
    }
  }

  showHelp() {
    alert(
      (resolve, reject) =>
        <div className="content-container">
          <Markdown className="classification-task-help">
            {this.props.help}
          </Markdown>
          <button autoFocus={true} className="standard-button" onClick={reject}>Close</button>
        </div>
    );
  }

  render() {
    let help;
    if (this.props.help) {
      help = (
        <div>
          <hr />
          <p>
            <small>
              <strong>
                <button type="button" className="minor-button" onClick={this.showHelp}>
                  Need some help with this task?
                </button>
              </strong>
            </small>
          </p>
        </div>
      );
    }
    let required;
    if (this.props.required) {
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
          {React.Children.map(this.props.answers, (answer) => {
            return React.cloneElement(answer, { className: `answer ${answer.props.className}` });
          })}
        </div>
        {required}
        {help}
      </div>
    );
  }
}

GenericTask.propTypes = {
  autoFocus: React.PropTypes.bool,
  question: React.PropTypes.string,
  help: React.PropTypes.string,
  required: React.PropTypes.oneOfType([
    React.PropTypes.number,
    React.PropTypes.bool
  ]),
  answers: React.PropTypes.arrayOf(React.PropTypes.node),
  children: React.PropTypes.node
};

GenericTask.defaultProps = {
  autoFocus: false,
  question: '',
  help: '',
  required: false,
  answers: []
};
