import { Markdown } from 'markdownz';
import PropTypes from 'prop-types';
import React from 'react';

class SubjectGroupComparisonSummary extends React.Component {
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
    // TODO
    return (
      <div>
        <div className="question">
          <Markdown>
            {this.props.task.question}
          </Markdown>
        </div>
      </div>
    );
  }
}

SubjectGroupComparisonSummary.propTypes = {
  task: PropTypes.shape(
    {
      question: PropTypes.string
    }
  ),
  translation: PropTypes.shape({
    questions: PropTypes.object
  }).isRequired,
  annotation: PropTypes.shape(
    { value: PropTypes.number }
  ).isRequired,
  expanded: PropTypes.bool
};

SubjectGroupComparisonSummary.defaultProps = {
  task: {
    question: ''
  },
  translation: {
    question: '',
    help: ''
  },
  expanded: false
};

export default SubjectGroupComparisonSummary;
