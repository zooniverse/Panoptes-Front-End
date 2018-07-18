import React from 'react';
import PropTypes from 'prop-types';
import { Markdown } from 'markdownz';
import SummaryAnswer from './summary-answer';

function ToggleButton({ expanded, onClick }) {
  return (
    <button
      type="button"
      className="toggle-more"
      onClick={onClick}
    >
      {expanded ? 'Less' : 'More'}
    </button>
  );
}

ToggleButton.propTypes = {
  expanded: PropTypes.bool,
  onClick: PropTypes.func
};

ToggleButton.defaultProps = {
  expanded: false,
  onClick: () => true
};

class DrawingSummary extends React.Component {
  static propTypes = {
    annotation: PropTypes.shape({
      value: PropTypes.array
    }),
    translation: PropTypes.shape({
      instruction: PropTypes.string,
      tools: PropTypes.array
    })
  }

  static defaultProps = {
    annotation: {},
    translation: {}
  }

  state = {
    expanded: false
  }

  toggleExpanded() {
    this.setState(prevState => ({ expanded: !prevState.expanded }));
  }

  render() {
    const { expanded } = this.state;
    const { value } = this.props.annotation;
    const { instruction, tools } = this.props.translation;
    const marksByTool = tools.map((tool, i) => value.filter(mark => mark.tool === i));
    return (
      <React.Fragment>
        <div className="question">
          <Markdown>
            {instruction}
          </Markdown>
          <ToggleButton
            expanded={expanded}
            onClick={this.toggleExpanded.bind(this)}
          />
        </div>
        {marksByTool.map((toolMarks, i) => (
          <SummaryAnswer
            key={tools[i]._key}
            expanded={expanded}
            tool={tools[i]}
            marks={toolMarks}
          />
        ))}
      </React.Fragment>
    );
  }
}

export default DrawingSummary;
