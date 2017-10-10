import React from 'react';
import { Markdown } from 'markdownz';
import Translate from 'react-translate-component';

class Summary extends React.Component {
  render() {
    let answer;

    if (this.props.annotation.value != null) {
      answer = this.props.annotation.value.map(index =>
        (<div key={index} className="answer">
          <i className="fa fa-check-circle-o fa-fw" />
          <Markdown tag="span" inline={true}>{this.props.task.answers[index].label}</Markdown>
        </div>)
      );
    } else {
      answer = <div className="answer"><Translate content="tasks.shortcut.noAnswer" /></div>;
    }

    return (
      <div>
        <div className="question">
          {this.props.task.question}
        </div>
        <div className="answers">
          {answer}
        </div>
      </div>
    );
  }
}

Summary.propTypes = {
  annotation: React.PropTypes.shape(
    { value: React.PropTypes.array }
  ).isRequired,
  task: React.PropTypes.shape(
    {
      answers: React.PropTypes.array,
      question: React.PropTypes.string
    }
  )
};

Summary.defaultProps = {
  annotation: { },
  task: {
    answers: [],
    question: ''
  }
};

export default Summary;
