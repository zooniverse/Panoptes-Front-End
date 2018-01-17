import { Markdown } from 'markdownz';
import PropTypes from 'prop-types';
import React from 'react';

class SingleChoiceSummary extends React.Component {
  constructor(props) {
    super(props);
    this.expand = this.expand.bind(this);
    this.collapse = this.collapse.bind(this);
    this.state = {
      expanded: this.props.expanded
    };
  }

  expand() {
    this.setState({ expanded: true });
  }

  collapse() {
    this.setState({ expanded: false });
  }

  render() {
    const { annotation, task, translation } = this.props;
    let toggleButton = <button type="button" className="toggle-more" onClick={this.expand}>More</button>;
    let answers = <div className="answer">No answer</div>;
    if (!this.state.expanded && annotation.value !== null) {
      answers = (
        <div className="answer">
          <i className="fa fa-check-circle-o fa-fw" />
          <Markdown tag="span" inline={true}>{translation.answers[annotation.value].label}</Markdown>
        </div>
      );
    }
    if (this.state.expanded) {
      toggleButton = <button type="button" className="toggle-more" onClick={this.collapse}>Less</button>;
      answers = [];
      for (const [i, answer] of task.answers.entries()) {
        if (!answer._key) {
          answer._key = Math.random();
        }
        let icon = <i className="fa fa-circle-o fa-fw" />;
        if (i === annotation.value) {
          icon = <i className="fa fa-check-circle-o fa-fw" />;
        }
        answers.push(
          <div key={answer._key} className="answer">
            {icon}
            <Markdown tag="span" inline={true}>{translation.answers[i].label}</Markdown>
          </div>
        );
      }
    }
    return (
      <div>
        <div className="question">
          <Markdown>
            {this.props.task.question}
          </Markdown>
          {toggleButton}
        </div>
        <div className="answers">
          {answers}
        </div>
      </div>
    );
  }
}

SingleChoiceSummary.propTypes = {
  task: PropTypes.shape(
    {
      answers: PropTypes.array,
      question: PropTypes.string
    }
  ),
  translation: PropTypes.shape({
    characteristics: PropTypes.object,
    choices: PropTypes.object,
    questions: PropTypes.object
  }).isRequired,
  annotation: PropTypes.shape(
    { value: PropTypes.number }
  ).isRequired,
  expanded: PropTypes.bool
};

SingleChoiceSummary.defaultProps = {
  task: {
    answers: [],
    question: ''
  },
  translation: {
    answers: [],
    question: '',
    help: ''
  },
  expanded: false
};

export default SingleChoiceSummary;