import { Markdown } from 'markdownz';
import PropTypes from 'prop-types';
import React from 'react';

class MultipleChoiceSummary extends React.Component {
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
    let answers = [<div key={0} className="answer">No answer</div>];
    if (!this.state.expanded && annotation.value.length > 0) {
      answers = annotation.value.map((index) => {
        return (
          <div key={index} className="answer">
            <i className="fa fa-check-square-o fa-fw" />
            <Markdown tag="span" inline={true}>{translation.answers[index].label}</Markdown>
          </div>
        );
      });
    }
    if (this.state.expanded) {
      toggleButton = <button type="button" className="toggle-more" onClick={this.collapse}>Less</button>;
      answers = [];
      for (const [i, answer] of task.answers.entries()) {
        if (!answer._key) {
          answer._key = Math.random();
        }
        let icon = <i className="fa fa-square-o fa-fw" />;
        if (annotation.value.includes(i)) {
          icon = <i className="fa fa-check-square-o fa-fw" />;
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
            {translation.question}
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

MultipleChoiceSummary.propTypes = {
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
    { value: PropTypes.array }
  ).isRequired,
  expanded: PropTypes.bool
};

MultipleChoiceSummary.defaultProps = {
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

export default MultipleChoiceSummary;